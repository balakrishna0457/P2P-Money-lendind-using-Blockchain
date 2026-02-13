const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailOTP: {
    code: String,
    expiresAt: Date
  },
  phoneOTP: {
    code: String,
    expiresAt: Date
  },
  creditScore: {
    type: Number,
    default: 500,
    min: 300,
    max: 900
  },
  isDefaulter: {
    type: Boolean,
    default: false
  },
  totalBorrowed: {
    type: Number,
    default: 0
  },
  totalLent: {
    type: Number,
    default: 0
  },
  activeLoans: {
    type: Number,
    default: 0
  },
  completedLoans: {
    type: Number,
    default: 0
  },
  defaultedLoans: {
    type: Number,
    default: 0
  },
  onTimePayments: {
    type: Number,
    default: 0
  },
  latePayments: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);
