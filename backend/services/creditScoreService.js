const User = require('../models/User');
const BorrowRequest = require('../models/BorrowRequest');

// Calculate credit score based on user's history
exports.calculateCreditScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 500;

    let score = 500; // Base score

    // Positive factors
    score += user.completedLoans * 20; // +20 per completed loan
    score += user.onTimePayments * 5; // +5 per on-time payment
    score += Math.min(user.totalLent / 10, 50); // Up to +50 for lending activity

    // Negative factors
    score -= user.defaultedLoans * 100; // -100 per defaulted loan
    score -= user.latePayments * 10; // -10 per late payment
    
    // Active loans factor
    if (user.activeLoans > 3) {
      score -= (user.activeLoans - 3) * 15; // Penalty for too many active loans
    }

    // Ensure score is within bounds
    score = Math.max(300, Math.min(900, score));

    return Math.round(score);
  } catch (error) {
    console.error('Credit score calculation error:', error);
    return 500;
  }
};

// Update user credit score
exports.updateCreditScore = async (userId) => {
  try {
    const newScore = await this.calculateCreditScore(userId);
    await User.findByIdAndUpdate(userId, { creditScore: newScore });
    return newScore;
  } catch (error) {
    console.error('Credit score update error:', error);
    throw error;
  }
};

// Record on-time payment
exports.recordOnTimePayment = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { onTimePayments: 1 }
    });
    await this.updateCreditScore(userId);
  } catch (error) {
    console.error('Record on-time payment error:', error);
  }
};

// Record late payment
exports.recordLatePayment = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { latePayments: 1 }
    });
    await this.updateCreditScore(userId);
  } catch (error) {
    console.error('Record late payment error:', error);
  }
};

// Record loan completion
exports.recordLoanCompletion = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { completedLoans: 1, activeLoans: -1 }
    });
    await this.updateCreditScore(userId);
  } catch (error) {
    console.error('Record loan completion error:', error);
  }
};

// Record loan default
exports.recordLoanDefault = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { defaultedLoans: 1, activeLoans: -1 },
      isDefaulter: true
    });
    await this.updateCreditScore(userId);
  } catch (error) {
    console.error('Record loan default error:', error);
  }
};

// Get credit score rating
exports.getCreditRating = (score) => {
  if (score >= 750) return 'Excellent';
  if (score >= 650) return 'Good';
  if (score >= 550) return 'Fair';
  if (score >= 450) return 'Poor';
  return 'Very Poor';
};
