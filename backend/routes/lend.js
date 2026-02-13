const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const LendingOffer = require('../models/LendingOffer');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { verifyToken, requireVerification } = require('../middleware/auth');
const blockchainService = require('../services/blockchainService');
const creditScoreService = require('../services/creditScoreService');

// Accept borrow request and create loan
router.post('/accept-request/:requestId', verifyToken, requireVerification, async (req, res) => {
  try {
    const { interestRate } = req.body;
    const request = await BorrowRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request not available' });
    }

    if (request.borrowerWallet === req.user.walletAddress) {
      return res.status(400).json({ error: 'Cannot lend to yourself' });
    }

    // Accept loan on blockchain
    const blockchainResult = await blockchainService.acceptLoan(
      request.contractLoanId,
      request.amount
    );

    if (!blockchainResult.success) {
      return res.status(500).json({ error: 'Blockchain transaction failed', details: blockchainResult.error });
    }

    // Update borrow request
    request.status = 'active';
    request.lender = req.user._id;
    request.lenderWallet = req.user.walletAddress;
    request.interestRate = interestRate || request.interestRate;
    request.startDate = new Date();
    request.endDate = new Date(Date.now() + request.duration * 24 * 60 * 60 * 1000);
    request.nextPaymentDue = new Date(Date.now() + (request.duration * 24 * 60 * 60 * 1000) / request.totalInstallments);
    request.disbursementTxHash = blockchainResult.txHash;
    await request.save();

    // Create lending offer record
    const lendingOffer = new LendingOffer({
      lender: req.user._id,
      lenderWallet: req.user.walletAddress,
      borrowRequest: request._id,
      amount: request.amount,
      interestRate: request.interestRate,
      duration: request.duration,
      status: 'active',
      acceptedAt: new Date()
    });
    await lendingOffer.save();

    // Record transaction
    const transaction = new Transaction({
      loan: request._id,
      type: 'disbursement',
      from: req.user.walletAddress,
      to: request.borrowerWallet,
      amount: request.amount,
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      status: 'confirmed'
    });
    await transaction.save();

    // Update lender stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalLent: request.amount }
    });

    res.json({
      success: true,
      message: 'Loan accepted successfully',
      loan: request,
      transaction: {
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber
      }
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Get lender's lending offers
router.get('/my-offers', verifyToken, async (req, res) => {
  try {
    const offers = await LendingOffer.find({ lender: req.user._id })
      .populate({
        path: 'borrowRequest',
        populate: { path: 'borrower', select: 'walletAddress name creditScore' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get lending history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const loans = await BorrowRequest.find({ lender: req.user._id })
      .populate('borrower', 'walletAddress name creditScore isDefaulter')
      .sort({ createdAt: -1 });

    res.json({ success: true, loans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Mark loan as defaulted
router.post('/mark-default/:loanId', verifyToken, async (req, res) => {
  try {
    const loan = await BorrowRequest.findById(req.params.loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only lender can mark as default' });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({ error: 'Loan not active' });
    }

    // Check if grace period is over (7 days after due date)
    const gracePeriod = 7 * 24 * 60 * 60 * 1000;
    if (new Date() < new Date(loan.nextPaymentDue.getTime() + gracePeriod)) {
      return res.status(400).json({ error: 'Grace period not over yet' });
    }

    // Mark as default on blockchain
    const blockchainResult = await blockchainService.markAsDefault(loan.contractLoanId);

    if (!blockchainResult.success) {
      return res.status(500).json({ error: 'Blockchain transaction failed' });
    }

    // Update loan status
    loan.status = 'defaulted';
    await loan.save();

    // Update borrower as defaulter
    await creditScoreService.recordLoanDefault(loan.borrower);

    res.json({
      success: true,
      message: 'Loan marked as defaulted',
      txHash: blockchainResult.txHash
    });
  } catch (error) {
    console.error('Mark default error:', error);
    res.status(500).json({ error: 'Failed to mark as default' });
  }
});

module.exports = router;
