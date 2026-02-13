const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRequest',
    required: true
  },
  type: {
    type: String,
    enum: ['collateral_lock', 'disbursement', 'installment', 'completion', 'default_claim', 'cancellation'],
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number
  },
  installmentNumber: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  gasUsed: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ loan: 1 });
transactionSchema.index({ txHash: 1 });
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
