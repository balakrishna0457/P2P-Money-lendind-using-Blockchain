const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { validateEmail, validatePhone } = require('../middleware/validation');
const otpService = require('../services/otpService');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-emailOTP -phoneOTP');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email && email !== req.user.email) {
      updates.email = email;
      updates.emailVerified = false;
    }
    if (phone && phone !== req.user.phone) {
      updates.phone = phone;
      updates.phoneVerified = false;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-emailOTP -phoneOTP');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Send email OTP
router.post('/send-email-otp', verifyToken, validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    const otp = otpService.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    await User.findByIdAndUpdate(req.user._id, {
      email,
      emailOTP: { code: otp, expiresAt }
    });

    // Send OTP
    const result = await otpService.sendEmailOTP(email, otp);

    if (result.success) {
      res.json({ success: true, message: 'OTP sent to email' });
    } else {
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify email OTP
router.post('/verify-email-otp', verifyToken, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    const verification = otpService.verifyOTP(
      user.emailOTP?.code,
      otp,
      user.emailOTP?.expiresAt
    );

    if (verification.valid) {
      user.emailVerified = true;
      user.emailOTP = undefined;
      await user.save();

      res.json({ success: true, message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: verification.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Send phone OTP
router.post('/send-phone-otp', verifyToken, validatePhone, async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = otpService.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(req.user._id, {
      phone,
      phoneOTP: { code: otp, expiresAt }
    });

    const result = await otpService.sendSMSOTP(phone, otp);

    if (result.success) {
      res.json({ success: true, message: 'OTP sent to phone' });
    } else {
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify phone OTP
router.post('/verify-phone-otp', verifyToken, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    const verification = otpService.verifyOTP(
      user.phoneOTP?.code,
      otp,
      user.phoneOTP?.expiresAt
    );

    if (verification.valid) {
      user.phoneVerified = true;
      user.phoneOTP = undefined;
      await user.save();

      res.json({ success: true, message: 'Phone verified successfully' });
    } else {
      res.status(400).json({ error: verification.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get user statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      stats: {
        creditScore: user.creditScore,
        totalBorrowed: user.totalBorrowed,
        totalLent: user.totalLent,
        activeLoans: user.activeLoans,
        completedLoans: user.completedLoans,
        defaultedLoans: user.defaultedLoans,
        onTimePayments: user.onTimePayments,
        latePayments: user.latePayments,
        isDefaulter: user.isDefaulter
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
