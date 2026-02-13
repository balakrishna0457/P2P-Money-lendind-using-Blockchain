const nodemailer = require('nodemailer');

// Initialize transporter only if email credentials are provided
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

exports.sendEmail = async (to, subject, html) => {
  // Skip email if not configured
  if (!transporter) {
    console.log('Email sending skipped - Email not configured');
    console.log(`Would send email to ${to}: ${subject}`);
    return { success: true, skipped: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
