const { ethers } = require('ethers');

// Validate Ethereum address
exports.validateAddress = (req, res, next) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }
  
  next();
};

// Validate email
exports.validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

// Validate phone number
exports.validatePhone = (req, res, next) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }
  
  next();
};

// Validate borrow request
exports.validateBorrowRequest = (req, res, next) => {
  const { amount, duration, totalInstallments, collateralType } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  if (!duration || duration <= 0) {
    return res.status(400).json({ error: 'Invalid duration' });
  }
  
  if (!totalInstallments || totalInstallments <= 0) {
    return res.status(400).json({ error: 'Invalid installments' });
  }
  
  if (!['OwnETH', 'FriendETH', 'Physical'].includes(collateralType)) {
    return res.status(400).json({ error: 'Invalid collateral type' });
  }
  
  if (collateralType === 'FriendETH') {
    const { friendWallet } = req.body;
    if (!friendWallet || !ethers.isAddress(friendWallet)) {
      return res.status(400).json({ error: 'Valid friend wallet address required' });
    }
  }
  
  if (collateralType === 'Physical') {
    const { physicalContacts } = req.body;
    if (!physicalContacts || physicalContacts.trim().length < 10) {
      return res.status(400).json({ error: 'Physical contacts required' });
    }
  }
  
  next();
};
