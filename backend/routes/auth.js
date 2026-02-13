const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyWalletSignature } = require('../middleware/auth');
const { validateAddress } = require('../middleware/validation');

// Connect wallet and get/create user
router.post('/connect-wallet', validateAddress, verifyWalletSignature, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const normalizedAddress = walletAddress.toLowerCase();

    // Find or create user
    let user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      user = new User({
        walletAddress: normalizedAddress,
        creditScore: 500
      });
      await user.save();
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { walletAddress: normalizedAddress, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        creditScore: user.creditScore,
        isDefaulter: user.isDefaulter
      }
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get nonce for wallet signature
router.get('/nonce/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const nonce = `Sign this message to authenticate with P2P Lending Platform.\n\nNonce: ${Date.now()}`;
    
    res.json({
      success: true,
      nonce,
      message: nonce
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

module.exports = router;
