# P2P Lending Platform - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- MetaMask browser extension
- Git installed

---

## 🚀 Quick Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
cd Downloads
cd p2p-lend

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../p2p-lend/p2p-lend
npm install
```

### 2. Setup Environment Variables (1 minute)

#### Backend (.env)
```bash
cd backend
copy .env.example .env
```

Edit `.env` with minimum required values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/p2p-lending
JWT_SECRET=your_secret_key_change_this_in_production
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=will_be_filled_after_deployment
```

#### Frontend (.env)
```bash
cd ../p2p-lend/p2p-lend
copy .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB (30 seconds)

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Sign up at https://cloud.mongodb.com
- Create free cluster
- Get connection string
- Update MONGODB_URI in backend/.env

### 4. Deploy Smart Contract (1 minute)

```bash
cd backend

# Compile contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Copy the contract address and update .env
# CONTRACT_ADDRESS=0x...
```

### 5. Start the Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd p2p-lend/p2p-lend
npm start
```

---

## 🎯 First Time Usage

### 1. Setup MetaMask
- Install MetaMask extension
- Create or import wallet
- Switch to Sepolia testnet
- Get test ETH from https://sepoliafaucet.com

### 2. Connect Wallet
- Open http://localhost:3000
- Click "Connect Wallet"
- Approve connection in MetaMask
- Sign authentication message

### 3. Complete Profile
- Enter your name, email, phone
- Verify email (check inbox for OTP)
- Verify phone (check SMS for OTP)

### 4. Create Your First Loan Request
- Navigate to "Borrow" section
- Fill in loan details:
  - Amount: 0.1 ETH
  - Duration: 30 days
  - Installments: 3
- Select collateral type: "Own ETH"
- Submit and confirm in MetaMask

### 5. Accept a Loan (Use Different Account)
- Switch MetaMask account
- Connect as lender
- Browse requests
- Accept a request
- Confirm transaction

---

## 📱 Key Features

### For Borrowers
✅ Connect wallet with MetaMask  
✅ Create loan requests  
✅ Choose collateral type (Own ETH, Friend ETH, Physical)  
✅ Pay monthly installments  
✅ Track credit score  

### For Lenders
✅ Browse loan requests  
✅ Check borrower credit scores  
✅ Accept loans with custom interest  
✅ Track active loans  
✅ Claim collateral on defaults  

---

## 🔧 Common Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start

# Compile smart contracts
npx hardhat compile

# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia

# Run tests
npm test
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

---

## 🐛 Troubleshooting

### MetaMask Not Connecting?
- Refresh page
- Check you're on Sepolia network
- Clear browser cache
- Try different browser

### Backend Not Starting?
- Check MongoDB is running
- Verify .env file exists
- Check port 5000 is available
- Run `npm install` again

### Transaction Failing?
- Ensure you have test ETH
- Check gas fees
- Verify contract address is correct
- Check MetaMask network

### OTP Not Received?
- For development, check console logs
- Email: Check spam folder
- SMS: Verify Twilio credentials

---

## 📚 Next Steps

1. **Read Full Documentation**
   - `PROJECT_SUMMARY.md` - Complete overview
   - `SETUP_GUIDE.md` - Detailed setup
   - `TESTING_GUIDE.md` - Testing procedures
   - `DEPLOYMENT_CHECKLIST.md` - Production deployment

2. **Explore the Code**
   - Backend: `backend/`
   - Smart Contracts: `backend/contracts/`
   - Frontend: `p2p-lend/p2p-lend/src/`

3. **Test All Features**
   - Create multiple loan types
   - Test payment flows
   - Try default scenarios
   - Check credit score updates

4. **Customize**
   - Update branding
   - Modify interest rates
   - Add new features
   - Enhance UI/UX

---

## 🌐 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/health
- **Sepolia Faucet:** https://sepoliafaucet.com
- **Sepolia Explorer:** https://sepolia.etherscan.io

---

## 💡 Pro Tips

1. **Use Multiple Wallets**
   - Create 2-3 MetaMask accounts
   - Test borrower and lender flows
   - Test friend collateral feature

2. **Monitor Transactions**
   - Check Sepolia Etherscan
   - View transaction details
   - Verify smart contract calls

3. **Check Logs**
   - Backend logs show API calls
   - Browser console shows frontend errors
   - MetaMask shows transaction status

4. **Save Test Data**
   - Note down wallet addresses
   - Save loan IDs
   - Keep track of test scenarios

---

## 📞 Need Help?

- Check `SETUP_GUIDE.md` for detailed instructions
- Review `TESTING_GUIDE.md` for testing help
- Check GitHub issues
- Review code comments

---

## 🎉 You're Ready!

Start building your P2P lending platform! 🚀

**Happy Coding!** 💻
