const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const BorrowRequest = require('../models/BorrowRequest');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const blockchainService = require('../services/blockchainService');
const creditScoreService = require('../services/creditScoreService');

// Get ETH to INR exchange rate
router.get('/exchange-rate', async (req, res) => {
  try {
    const rate = await paymentService.getETHtoINR();
    res.json({ success: true, ethToInr: rate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

// Convert INR to ETH
router.post('/convert-inr-to-eth', async (req, res) => {
  try {
    const { amountINR } = req.body;
    
    if (!amountINR || amountINR <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const conversion = await paymentService.convertINRtoETH(amountINR);
    res.json({ success: true, ...conversion });
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// Create Razorpay order for INR to ETH
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amountINR } = req.body;

    if (!amountINR || amountINR <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get conversion details
    const conversion = await paymentService.convertINRtoETH(amountINR);

    // Create Razorpay order
    const orderResult = await paymentService.createRazorpayOrder(
      amountINR,
      req.user._id,
      req.user.walletAddress
    );

    if (!orderResult.success) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Save payment record
    const payment = new Payment({
      user: req.user._id,
      walletAddress: req.user.walletAddress,
      type: 'inr_to_eth',
      amountINR,
      amountETH: conversion.amountETH,
      exchangeRate: conversion.exchangeRate,
      paymentGateway: 'razorpay',
      orderId: orderResult.orderId,
      status: 'created'
    });
    await payment.save();

    res.json({
      success: true,
      order: {
        orderId: orderResult.orderId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        amountETH: conversion.amountETH
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment and credit ETH
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Verify payment signature
    const isValid = paymentService.verifyRazorpayPayment(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Find payment record
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Update payment status
    payment.status = 'completed';
    payment.paymentId = paymentId;
    await payment.save();

    // Note: In production, you would transfer ETH to user's wallet here
    // For now, we'll just mark it as completed
    // const txHash = await transferETHToUser(payment.walletAddress, payment.amountETH);
    // payment.txHash = txHash;
    // await payment.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      amountETH: payment.amountETH,
      payment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Pay loan installment
router.post('/pay-installment/:loanId', verifyToken, async (req, res) => {
  try {
    const loan = await BorrowRequest.findById(req.params.loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({ error: 'Loan not active' });
    }

    if (loan.paidInstallments >= loan.totalInstallments) {
      return res.status(400).json({ error: 'All installments already paid' });
    }

    // Pay installment on blockchain (requires borrower's signature)
    // Note: In production, this would be called from frontend with user's wallet
    // For now, we'll simulate the payment
    
    const installmentNumber = loan.paidInstallments + 1;
    const isOnTime = new Date() <= loan.nextPaymentDue;

    // Update loan
    loan.paidInstallments += 1;
    
    if (loan.paidInstallments < loan.totalInstallments) {
      const installmentInterval = (loan.duration * 24 * 60 * 60 * 1000) / loan.totalInstallments;
      loan.nextPaymentDue = new Date(loan.startDate.getTime() + installmentInterval * (loan.paidInstallments + 1));
    }

    // Check if loan is completed
    if (loan.paidInstallments === loan.totalInstallments) {
      loan.status = 'completed';
      await creditScoreService.recordLoanCompletion(loan.borrower);
    }

    await loan.save();

    // Record payment timing
    if (isOnTime) {
      await creditScoreService.recordOnTimePayment(loan.borrower);
    } else {
      await creditScoreService.recordLatePayment(loan.borrower);
    }

    res.json({
      success: true,
      message: 'Installment paid successfully',
      installmentNumber,
      remainingInstallments: loan.totalInstallments - loan.paidInstallments,
      loanCompleted: loan.status === 'completed'
    });
  } catch (error) {
    console.error('Pay installment error:', error);
    res.status(500).json({ error: 'Failed to pay installment' });
  }
});

// Get payment history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
