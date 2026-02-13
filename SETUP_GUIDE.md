# P2P Lending Platform - Complete Setup Guide

## 🎯 Project Overview
A decentralized P2P lending platform with MetaMask authentication, smart contracts, OTP verification, INR-to-ETH conversion, and credit scoring.

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- MetaMask browser extension
- Infura/Alchemy account (for blockchain)
- Razorpay account (for payments)
- Twilio account (for SMS OTP)
- Gmail account (for email OTP)

---

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in backend directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/p2p-lending

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Ethereum (Sepolia Testnet)
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CoinGecko
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

### 3. Deploy Smart Contract
```bash
# Compile contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Copy the deployed contract address to .env
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

### 5. Start Backend Server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd p2p-lend/p2p-lend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Start Frontend
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🔧 Configuration Details

### Gmail App Password Setup
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this password in EMAIL_PASSWORD

### Twilio Setup
1. Sign up at twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Add to .env file

### Razorpay Setup
1. Sign up at razorpay.com
2. Get API Key ID and Secret from Dashboard
3. Enable Test Mode for development
4. Add to .env files

### Infura/Alchemy Setup
1. Sign up at infura.io or alchemy.com
2. Create new project
3. Get Sepolia testnet RPC URL
4. Add to ETHEREUM_RPC_URL

---

## 📱 User Flow

### 1. **Wallet Connection**
- User clicks "Connect Wallet"
- MetaMask prompts for connection
- User signs authentication message
- Backend creates/retrieves user account
- JWT token issued

### 2. **Profile Setup & Verification**
- User enters name, email, phone
- OTP sent to email and phone
- User verifies both
- Profile marked as verified

### 3. **Fund Wallet (INR to ETH)**
- User enters INR amount
- System shows ETH equivalent
- Razorpay payment gateway opens
- Payment verified
- ETH credited to wallet

### 4. **Borrowing Flow**
- User fills borrow form:
  - Amount, duration, installments
  - Select collateral type:
    - **Own ETH**: Lock own ETH as collateral
    - **Friend ETH**: Friend locks ETH
    - **Physical**: Provide trusted contacts
- Smart contract creates loan
- Request visible to all lenders

### 5. **Lending Flow**
- Lender views borrow requests
- Checks borrower's credit score
- Sets interest rate
- Accepts request
- Smart contract transfers funds
- Loan becomes active

### 6. **Repayment Flow**
- Borrower pays monthly installments
- Smart contract records payment
- Credit score updated
- On completion: collateral released
- On default: lender gets collateral

---

## 🔐 Smart Contract Functions

### Borrower Functions
- `createLoan()` - Create borrow request
- `payInstallment()` - Pay monthly installment
- `cancelLoan()` - Cancel pending request

### Lender Functions
- `acceptLoan()` - Accept and fund loan
- `markAsDefault()` - Mark overdue loan as defaulted

### Friend Functions
- `lockFriendCollateral()` - Lock collateral for friend

---

## 📊 Database Collections

### Users
- Wallet address (unique)
- Name, email, phone
- Verification status
- Credit score
- Loan statistics

### BorrowRequests
- Borrower, lender
- Amount, duration, interest
- Collateral type
- Status, installments
- Blockchain loan ID

### Transactions
- Loan reference
- Type (disbursement, installment, etc.)
- Amount, tx hash
- Timestamp

### Payments
- INR to ETH conversions
- Razorpay order details
- Status tracking

---

## 🧪 Testing

### 1. Get Test ETH
- Visit Sepolia faucet: https://sepoliafaucet.com
- Enter your wallet address
- Receive test ETH

### 2. Test Flow
1. Connect MetaMask wallet
2. Complete profile verification
3. Create borrow request
4. Accept request from another wallet
5. Pay installments
6. Complete loan

---

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/connect-wallet` - Connect wallet
- `GET /api/auth/nonce/:address` - Get nonce

### User
- `GET /api/user/profile` - Get profile
- `POST /api/user/send-email-otp` - Send email OTP
- `POST /api/user/verify-email-otp` - Verify email

### Borrow
- `POST /api/borrow/create-request` - Create request
- `GET /api/borrow/requests` - Get all requests
- `GET /api/borrow/my-requests` - Get user's requests

### Lend
- `POST /api/lend/accept-request/:id` - Accept request
- `GET /api/lend/history` - Get lending history

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/pay-installment/:id` - Pay installment

### Credit
- `GET /api/credit/score` - Get credit score
- `GET /api/credit/history` - Get credit history

---

## 🛠️ Troubleshooting

### MetaMask Not Connecting
- Ensure MetaMask is installed
- Check network (should be Sepolia)
- Clear browser cache

### Backend Not Starting
- Check MongoDB is running
- Verify .env variables
- Check port 5000 is available

### Smart Contract Errors
- Ensure contract is deployed
- Check wallet has test ETH
- Verify contract address in .env

### OTP Not Sending
- Check email/phone credentials
- Verify Twilio/Gmail settings
- Check API limits

---

## 📝 Notes

- Use Sepolia testnet for development
- Never commit .env files
- Keep private keys secure
- Test thoroughly before mainnet
- Monitor gas fees
- Implement rate limiting in production

---

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set environment variables
4. Deploy

### Smart Contract (Mainnet)
1. Get mainnet ETH
2. Update hardhat.config.js
3. Deploy to mainnet
4. Verify on Etherscan

---

## 📞 Support
For issues or questions, check the code comments or create an issue in the repository.
