const Razorpay = require('razorpay');
const axios = require('axios');
const crypto = require('crypto');

// Initialize Razorpay only if credentials are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Get ETH to INR exchange rate
exports.getETHtoINR = async () => {
  try {
    const response = await axios.get(
      `${process.env.COINGECKO_API_URL}/simple/price?ids=ethereum&vs_currencies=inr`
    );
    return response.data.ethereum.inr;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    throw new Error('Failed to fetch exchange rate');
  }
};

// Get INR to ETH conversion
exports.convertINRtoETH = async (amountINR) => {
  const ethToInr = await this.getETHtoINR();
  const amountETH = amountINR / ethToInr;
  return {
    amountINR,
    amountETH,
    exchangeRate: ethToInr
  };
};

// Create Razorpay order
exports.createRazorpayOrder = async (amountINR, userId, walletAddress) => {
  // Check if Razorpay is configured
  if (!razorpay) {
    console.log('Razorpay not configured - Payment feature disabled');
    return {
      success: false,
      error: 'Payment gateway not configured. Please contact administrator.'
    };
  }

  try {
    const options = {
      amount: Math.round(amountINR * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        walletAddress: walletAddress,
        purpose: 'ETH_PURCHASE'
      }
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = (orderId, paymentId, signature) => {
  try {
    const text = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

// Calculate installment amount
exports.calculateInstallment = (principal, interestRate, totalInstallments) => {
  const totalRepayment = principal + (principal * interestRate / 10000);
  const installmentAmount = totalRepayment / totalInstallments;
  return {
    installmentAmount: parseFloat(installmentAmount.toFixed(6)),
    totalRepayment: parseFloat(totalRepayment.toFixed(6)),
    totalInterest: parseFloat((totalRepayment - principal).toFixed(6))
  };
};
