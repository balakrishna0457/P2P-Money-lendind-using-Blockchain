const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ethers } = require('ethers');

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ walletAddress: decoded.walletAddress.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.walletAddress = decoded.walletAddress;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Verify wallet signature
exports.verifyWalletSignature = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    req.walletAddress = walletAddress.toLowerCase();
    next();
  } catch (error) {
    console.error('Signature verification error:', error);
    res.status(401).json({ error: 'Signature verification failed' });
  }
};

// Check if user is verified
exports.requireVerification = async (req, res, next) => {
  try {
    if (!req.user.emailVerified || !req.user.phoneVerified) {
      return res.status(403).json({ 
        error: 'Email and phone verification required',
        emailVerified: req.user.emailVerified,
        phoneVerified: req.user.phoneVerified
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Verification check failed' });
  }
};

// Check if user is not a defaulter
exports.checkDefaulterStatus = async (req, res, next) => {
  try {
    if (req.user.isDefaulter) {
      return res.status(403).json({ 
        error: 'Account restricted due to defaulted loans',
        isDefaulter: true
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Defaulter check failed' });
  }
};
