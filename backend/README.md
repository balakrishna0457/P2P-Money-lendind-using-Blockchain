# P2P Lending Platform Backend

## Overview
Backend system for P2P lending platform with MetaMask authentication, smart contracts, OTP verification, INR-to-ETH conversion, and credit scoring.

## Features
- **MetaMask Wallet Authentication**: Users login with their wallet address
- **OTP Verification**: Email and phone number verification
- **INR to ETH Conversion**: Integrated payment gateway for wallet funding
- **Smart Contracts**: Secure lending with 3 collateral types (Own ETH, Friend ETH, Physical Contacts)
- **Installment System**: Monthly payment tracking
- **Credit Score System**: Dynamic credit scoring based on payment history
- **Defaulter Tracking**: Automatic marking of defaulters

## Project Structure
```
backend/
├── contracts/              # Solidity smart contracts
│   └── P2PLending.sol
├── models/                 # MongoDB schemas
│   ├── User.js
│   ├── BorrowRequest.js
│   ├── LendingOffer.js
│   ├── Transaction.js
│   └── CreditScore.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── user.js
│   ├── borrow.js
│   ├── lend.js
│   └── payment.js
├── middleware/             # Express middleware
│   ├── auth.js
│   └── validation.js
├── services/               # Business logic
│   ├── otpService.js
│   ├── paymentService.js
│   ├── creditScoreService.js
│   └── blockchainService.js
├── utils/                  # Utility functions
│   ├── emailSender.js
│   └── smsSender.js
├── config/                 # Configuration files
│   └── database.js
├── server.js               # Main server file
├── package.json
└── .env
```

## Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment Variables**
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

3. **Setup MongoDB**
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in `.env`

4. **Deploy Smart Contract**
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
Update `CONTRACT_ADDRESS` in `.env` with deployed address

5. **Start Server**
```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

## API Endpoints

### Authentication
- `POST /api/auth/connect-wallet` - Connect MetaMask wallet
- `POST /api/auth/verify-wallet` - Verify wallet signature
- `POST /api/auth/logout` - Logout user

### User Management
- `POST /api/user/register` - Register user with details
- `POST /api/user/send-otp` - Send OTP to email/phone
- `POST /api/user/verify-otp` - Verify OTP
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Borrow Operations
- `POST /api/borrow/create-request` - Create borrow request
- `GET /api/borrow/requests` - Get all active borrow requests
- `GET /api/borrow/my-requests` - Get user's borrow requests
- `PUT /api/borrow/cancel/:id` - Cancel borrow request

### Lend Operations
- `POST /api/lend/accept-request` - Accept borrow request
- `POST /api/lend/create-offer` - Create lending offer
- `GET /api/lend/my-offers` - Get user's lending offers
- `GET /api/lend/history` - Get lending history

### Payment & Transactions
- `POST /api/payment/create-order` - Create Razorpay order for INR
- `POST /api/payment/verify` - Verify payment and credit ETH
- `POST /api/payment/installment` - Pay monthly installment
- `GET /api/payment/installments/:loanId` - Get installment schedule

### Credit Score
- `GET /api/credit/score` - Get user's credit score
- `GET /api/credit/history` - Get credit history

## Smart Contract Functions

### P2PLending.sol
- `createLoan()` - Create new loan with collateral
- `acceptLoan()` - Lender accepts and funds loan
- `payInstallment()` - Borrower pays monthly installment
- `completeLoan()` - Mark loan as completed
- `markDefault()` - Mark borrower as defaulter
- `releaseFunds()` - Release funds to lender on completion

## Database Schema

### User
- walletAddress (unique)
- name, email, phone
- emailVerified, phoneVerified
- creditScore
- isDefaulter
- createdAt, updatedAt

### BorrowRequest
- borrower (User reference)
- amount, duration
- interestRate
- collateralType (OwnETH, FriendETH, Physical)
- friendWallet, contacts
- status (pending, active, completed, defaulted)
- lender (User reference)

### LendingOffer
- lender (User reference)
- borrowRequest (BorrowRequest reference)
- amount, interestRate, duration
- status

### Transaction
- loan (BorrowRequest reference)
- type (disbursement, installment, completion)
- amount, txHash
- timestamp

### CreditScore
- user (User reference)
- score (300-900)
- loansCompleted, loansDefaulted
- onTimePayments, latePayments

## Testing

Test with MetaMask on Sepolia testnet:
1. Get test ETH from Sepolia faucet
2. Connect wallet to application
3. Test borrow/lend flow

## Security Features
- JWT-based authentication
- Wallet signature verification
- OTP verification for sensitive operations
- Smart contract security (reentrancy protection)
- Rate limiting on API endpoints

## License
ISC
