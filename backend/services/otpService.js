const nodemailer = require('nodemailer');

// Email transporter (optional)
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Twilio client (optional - lazy load)
let twilioClient = null;
const getTwilioClient = () => {
  if (twilioClient) return twilioClient;
  
  if (process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      return twilioClient;
    } catch (error) {
      console.warn('Twilio initialization failed:', error.message);
      return null;
    }
  }
  return null;
}

// Generate OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email OTP
exports.sendEmailOTP = async (email, otp) => {
  try {
    if (!emailTransporter) {
      console.log('Email not configured. OTP:', otp);
      return { success: true, message: 'Email service not configured. Check console for OTP.' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'P2P Lending - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <h1 style="color: #00c896; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email OTP send error:', error);
    return { success: false, error: error.message };
  }
};

// Send SMS OTP
exports.sendSMSOTP = async (phone, otp) => {
  try {
    const client = getTwilioClient();
    
    if (!client) {
      console.log('SMS not configured. OTP for', phone, ':', otp);
      return { success: true, message: 'SMS service not configured. Check console for OTP.' };
    }

    await client.messages.create({
      body: `Your P2P Lending verification OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return { success: true };
  } catch (error) {
    console.error('SMS OTP send error:', error);
    return { success: false, error: error.message };
  }
};

// Verify OTP
exports.verifyOTP = (storedOTP, providedOTP, expiresAt) => {
  if (!storedOTP || !expiresAt) {
    return { valid: false, message: 'No OTP found' };
  }

  if (new Date() > new Date(expiresAt)) {
    return { valid: false, message: 'OTP expired' };
  }

  if (storedOTP !== providedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }

  return { valid: true, message: 'OTP verified' };
};
