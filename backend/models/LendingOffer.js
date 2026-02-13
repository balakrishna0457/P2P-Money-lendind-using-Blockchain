const mongoose = require('mongoose');

const lendingOfferSchema = new mongoose.Schema({
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lenderWallet: {
    type: String,
    required: true
  },
  borrowRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRequest',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['available', 'accepted', 'active', 'completed', 'cancelled'],
    default: 'available'
  },
  acceptedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
lendingOfferSchema.index({ lender: 1 });
lendingOfferSchema.index({ status: 1 });

module.exports = mongoose.model('LendingOffer', lendingOfferSchema);
