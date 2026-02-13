const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const User = require('../models/User');
const { verifyToken, requireVerification, checkDefaulterStatus } = require('../middleware/auth');
const { validateBorrowRequest } = require('../middleware/validation');
const blockchainService = require('../services/blockchainService');
const paymentService = require('../services/paymentService');

// Create borrow request
router.post('/create-request', verifyToken, requireVerification, checkDefaulterStatus, validateBorrowRequest, async (req, res) => {
  try {
    const { amount, duration, interestRate, totalInstallments, collateralType, friendWallet, physicalContacts } = req.body;

    // Calculate installment details
    const installmentDetails = paymentService.calculateInstallment(
      amount,
      interestRate || 0,
      totalInstallments
    );

    // Create loan on blockchain
    const blockchainResult = await blockchainService.createLoan(
      req.user.walletAddress,
      amount,
      interestRate || 0,
      duration,
      totalInstallments,
      collateralType,
      friendWallet || null,
      physicalContacts || ''
    );

    if (!blockchainResult.success) {
      return res.status(500).json({ error: 'Blockchain transaction failed', details: blockchainResult.error });
    }

    // Create borrow request in database
    const borrowRequest = new BorrowRequest({
      borrower: req.user._id,
      borrowerWallet: req.user.walletAddress,
      amount,
      duration,
      interestRate: interestRate || 0,
      totalInstallments,
      installmentAmount: installmentDetails.installmentAmount,
      collateralType,
      friendWallet: friendWallet || null,
      physicalContacts: physicalContacts || null,
      contractLoanId: blockchainResult.loanId,
      collateralLocked: collateralType === 'OwnETH',
      collateralTxHash: blockchainResult.txHash
    });

    await borrowRequest.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { activeLoans: 1, totalBorrowed: amount }
    });

    res.json({
      success: true,
      borrowRequest,
      blockchain: {
        txHash: blockchainResult.txHash,
        loanId: blockchainResult.loanId
      }
    });
  } catch (error) {
    console.error('Create borrow request error:', error);
    res.status(500).json({ error: 'Failed to create borrow request' });
  }
});

// Get all active borrow requests
router.get('/requests', verifyToken, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ status: 'pending' })
      .populate('borrower', 'walletAddress name creditScore isDefaulter')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get user's borrow requests
router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.user._id })
      .populate('lender', 'walletAddress name')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your requests' });
  }
});

// Get specific borrow request
router.get('/request/:id', verifyToken, async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id)
      .populate('borrower', 'walletAddress name email phone creditScore')
      .populate('lender', 'walletAddress name');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Cancel borrow request
router.put('/cancel/:id', verifyToken, async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending requests' });
    }

    request.status = 'cancelled';
    await request.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { activeLoans: -1, totalBorrowed: -request.amount }
    });

    res.json({ success: true, message: 'Request cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Get installment schedule
router.get('/installments/:loanId', verifyToken, async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.loanId);

    if (!request) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check authorization
    if (request.borrower.toString() !== req.user._id.toString() && 
        (!request.lender || request.lender.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Generate installment schedule
    const installments = [];
    const installmentInterval = (request.duration * 24 * 60 * 60 * 1000) / request.totalInstallments;

    for (let i = 0; i < request.totalInstallments; i++) {
      const dueDate = new Date(request.startDate.getTime() + installmentInterval * (i + 1));
      installments.push({
        number: i + 1,
        amount: request.installmentAmount,
        dueDate,
        isPaid: i < request.paidInstallments,
        status: i < request.paidInstallments ? 'paid' : 
                (new Date() > dueDate ? 'overdue' : 'pending')
      });
    }

    res.json({ success: true, installments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch installments' });
  }
});

module.exports = router;
