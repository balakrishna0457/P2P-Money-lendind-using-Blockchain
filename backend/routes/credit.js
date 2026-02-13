const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const creditScoreService = require('../services/creditScoreService');
const BorrowRequest = require('../models/BorrowRequest');

// Get user's credit score
router.get('/score', verifyToken, async (req, res) => {
  try {
    const score = await creditScoreService.calculateCreditScore(req.user._id);
    const rating = creditScoreService.getCreditRating(score);

    res.json({
      success: true,
      creditScore: score,
      rating,
      user: {
        completedLoans: req.user.completedLoans,
        defaultedLoans: req.user.defaultedLoans,
        onTimePayments: req.user.onTimePayments,
        latePayments: req.user.latePayments,
        isDefaulter: req.user.isDefaulter
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit score' });
  }
});

// Get credit history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const loans = await BorrowRequest.find({ borrower: req.user._id })
      .populate('lender', 'walletAddress name')
      .select('amount duration status paidInstallments totalInstallments startDate endDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, loans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit history' });
  }
});

// Refresh credit score
router.post('/refresh', verifyToken, async (req, res) => {
  try {
    const newScore = await creditScoreService.updateCreditScore(req.user._id);
    const rating = creditScoreService.getCreditRating(newScore);

    res.json({
      success: true,
      creditScore: newScore,
      rating,
      message: 'Credit score updated'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh credit score' });
  }
});

module.exports = router;
