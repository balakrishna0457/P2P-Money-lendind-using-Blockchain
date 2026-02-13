const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cron = require('node-cron');
const BorrowRequest = require('./models/BorrowRequest');
const creditScoreService = require('./services/creditScoreService');
const { sendEmail } = require('./utils/emailSender');
const { sendSMS } = require('./utils/smsSender');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/borrow', require('./routes/borrow'));
app.use('/api/lend', require('./routes/lend'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/credit', require('./routes/credit'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'P2P Lending API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'P2P Lending Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      borrow: '/api/borrow',
      lend: '/api/lend',
      payment: '/api/payment',
      credit: '/api/credit'
    }
  });
});

// Cron job: Check for overdue payments (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily overdue payment check...');
    
    const activeLoans = await BorrowRequest.find({ status: 'active' });
    const now = new Date();
    
    for (const loan of activeLoans) {
      // Check if payment is overdue (7 days grace period)
      const gracePeriod = 7 * 24 * 60 * 60 * 1000;
      const overdueDate = new Date(loan.nextPaymentDue.getTime() + gracePeriod);
      
      if (now > overdueDate && loan.paidInstallments < loan.totalInstallments) {
        console.log(`Loan ${loan._id} is overdue. Marking as defaulted.`);
        
        // Mark as defaulted
        loan.status = 'defaulted';
        await loan.save();
        
        // Update borrower credit score
        await creditScoreService.recordLoanDefault(loan.borrower);
      }
    }
    
    console.log('Overdue payment check completed');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Cron job: Send payment reminders (runs daily at 9 AM)
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Sending payment reminders...');
    
    const activeLoans = await BorrowRequest.find({ status: 'active' })
      .populate('borrower', 'email phone name');
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    for (const loan of activeLoans) {
      // Send reminder if payment is due within 3 days
      if (loan.nextPaymentDue <= threeDaysFromNow && loan.nextPaymentDue > now) {
        console.log(`Sending reminder to ${loan.borrower.email} for loan ${loan._id}`);
        
        const daysUntilDue = Math.ceil((loan.nextPaymentDue - now) / (24 * 60 * 60 * 1000));
        const installmentNumber = loan.paidInstallments + 1;
        
        // Send email reminder
        if (loan.borrower.email) {
          const emailSubject = 'Payment Reminder - P2P Lending';
          const emailBody = `
            <h2>Payment Reminder</h2>
            <p>Dear ${loan.borrower.name || 'Borrower'},</p>
            <p>This is a friendly reminder that your loan installment payment is due in ${daysUntilDue} day(s).</p>
            <p><strong>Loan Details:</strong></p>
            <ul>
              <li>Loan Amount: ${loan.amount} ETH</li>
              <li>Installment ${installmentNumber} of ${loan.totalInstallments}</li>
              <li>Amount Due: ${loan.installmentAmount} ETH</li>
              <li>Due Date: ${loan.nextPaymentDue.toLocaleDateString()}</li>
            </ul>
            <p>Please ensure timely payment to maintain your credit score.</p>
            <p>Thank you for using P2P Lending Platform!</p>
          `;
          await sendEmail(loan.borrower.email, emailSubject, emailBody);
        }
        
        // Send SMS reminder
        if (loan.borrower.phone) {
          const smsMessage = `P2P Lending: Payment reminder! Installment ${installmentNumber}/${loan.totalInstallments} of ${loan.installmentAmount} ETH is due in ${daysUntilDue} day(s). Due: ${loan.nextPaymentDue.toLocaleDateString()}`;
          await sendSMS(loan.borrower.phone, smsMessage);
        }
      }
    }
    
    console.log('Payment reminders sent');
  } catch (error) {
    console.error('Reminder cron job error:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API available at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
