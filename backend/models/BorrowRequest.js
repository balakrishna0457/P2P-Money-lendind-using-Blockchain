const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerWallet: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  interestRate: {
    type: Number,
    default: 0,
    min: 0
  },
  totalInstallments: {
    type: Number,
    required: true,
    min: 1
  },
  installmentAmount: {
    type: Number,
    required: true
  },
  collateralType: {
    type: String,
    enum: ['OwnETH', 'FriendETH', 'Physical'],
    required: true
  },
  friendWallet: {
    type: String,
    default: null
  },
  physicalContacts: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'defaulted', 'cancelled'],
    default: 'pending'
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lenderWallet: {
    type: String,
    default: null
  },
  contractLoanId: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  nextPaymentDue: {
    type: Date,
    default: null
  },
  paidInstallments: {
    type: Number,
    default: 0
  },
  collateralLocked: {
    type: Boolean,
    default: false
  },
  collateralTxHash: {
    type: String,
    default: null
  },
  disbursementTxHash: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
borrowRequestSchema.index({ borrower: 1 });
borrowRequestSchema.index({ lender: 1 });
borrowRequestSchema.index({ status: 1 });
borrowRequestSchema.index({ borrowerWallet: 1 });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
