# 🏦 P2P Lending Platform

A decentralized peer-to-peer lending platform built on Ethereum blockchain with MetaMask authentication, smart contracts, and comprehensive loan management features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Solidity](https://img.shields.io/badge/solidity-0.8.19-orange.svg)

## ✨ Features

### 🔐 Secure Authentication
- MetaMask wallet integration
- Cryptographic signature verification
- JWT-based session management
- Email & SMS OTP verification

### 💰 Flexible Lending
- Create custom loan requests
- Browse available lending opportunities
- Dynamic interest rate negotiation
- Multiple collateral options:
  - **Own ETH**: Lock your own ETH as collateral
  - **Friend ETH**: Friend locks ETH on your behalf
  - **Physical**: Physical collateral with trusted contacts

### 📊 Credit System
- Dynamic credit scoring (300-900)
- On-chain credit history
- Reward on-time payments
- Penalty for defaults
- Defaulter tracking

### 💳 Payment Integration
- INR to ETH conversion via Razorpay
- Real-time exchange rates (CoinGecko)
- Monthly installment system
- Automated payment reminders
- Transaction tracking

### 🤖 Automation
- Daily overdue payment detection
- Automatic default marking (7-day grace period)
- Email/SMS payment reminders
- Credit score auto-updates

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB
- MetaMask browser extension
- Infura/Alchemy account (for blockchain)

### Installation

```bash
# Clone repository
cd p2p-lend

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../p2p-lend/p2p-lend
npm install
```

### Configuration

1. **Backend Environment** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/p2p-lending
JWT_SECRET=your_secret_key
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=deployed_contract_address
```

2. **Frontend Environment** (`p2p-lend/p2p-lend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

### Deploy Smart Contract

```bash
cd backend
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### Start Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd p2p-lend/p2p-lend
npm start
```

Visit http://localhost:3000 🎉

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing procedures
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete project overview

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.2
- React Router 6
- Ethers.js 6
- Axios
- Context API

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Ethers.js
- Node-cron

**Blockchain:**
- Solidity 0.8.19
- Hardhat
- Ethereum (Sepolia testnet)

**Integrations:**
- Razorpay (Payments)
- Twilio (SMS)
- Nodemailer (Email)
- CoinGecko (Exchange rates)

### Project Structure

```
p2p-lend/
├── backend/
│   ├── contracts/          # Smart contracts
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Auth & validation
│   ├── utils/             # Helper functions
│   └── server.js          # Main server
│
├── p2p-lend/p2p-lend/    # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   ├── modules/       # Feature modules
│   │   ├── services/      # API services
│   │   └── routes/        # Route configuration
│   └── public/
│
└── docs/                  # Documentation
```

## 🔑 Key Features

### For Borrowers
✅ Connect wallet with MetaMask  
✅ Create loan requests with custom terms  
✅ Choose collateral type  
✅ Pay monthly installments  
✅ Track credit score  
✅ View loan history  

### For Lenders
✅ Browse loan requests  
✅ Check borrower credit scores  
✅ Accept loans with custom interest  
✅ Track active loans  
✅ Claim collateral on defaults  
✅ View lending history  

## 🛡️ Security Features

- Smart contract security (reentrancy protection, access control)
- Wallet signature verification
- JWT token authentication
- Input validation & sanitization
- Rate limiting
- CORS protection
- OTP verification

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd p2p-lend/p2p-lend
npm test

# Smart contract tests
cd backend
npx hardhat test
```

See [Testing Guide](TESTING_GUIDE.md) for comprehensive testing procedures.
## 🛠️ Tech Stack

*   **Blockchain:** Solidity, Polygon (MATIC), Hardhat
*   **Frontend:** React.js, Ethers.js, CSS Modules
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose)
*   **APIs:** 
    *   **CoinGecko:** Real-time crypto price feeds
    *   **Razorpay:** Fiat-to-crypto payment gateway
    *   **Twilio/Nodemailer:** SMS and Email notifications


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Hardhat for development environment
- Ethers.js for blockchain interactions
- React community for frontend tools

## 📞 Support

For issues and questions:
- Check [documentation](docs/)
- Review [testing guide](TESTING_GUIDE.md)
- Open GitHub issue

## 🎯 Roadmap

- [ ] Multi-chain support (Polygon, BSC)
- [ ] NFT collateral support
- [ ] Governance token
- [ ] Staking rewards
- [ ] Mobile app
- [ ] Advanced analytics dashboard

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ using Blockchain Technology**
