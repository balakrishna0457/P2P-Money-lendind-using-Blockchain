const twilio = require('twilio');

// Initialize Twilio client only if credentials are provided
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

exports.sendSMS = async (to, message) => {
  // Skip SMS if Twilio is not configured
  if (!client) {
    console.log('SMS sending skipped - Twilio not configured');
    console.log(`Would send SMS to ${to}: ${message}`);
    return { success: true, skipped: true };
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};
