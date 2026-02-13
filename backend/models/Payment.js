const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['inr_to_eth', 'withdrawal'],
    required: true
  },
  amountINR: {
    type: Number,
    required: true
  },
  amountETH: {
    type: Number,
    required: true
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'manual'],
    default: 'razorpay'
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'completed', 'failed', 'refunded'],
    default: 'created'
  },
  txHash: {
    type: String,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
