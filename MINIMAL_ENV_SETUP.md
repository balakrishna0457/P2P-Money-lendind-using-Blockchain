# 🔧 Minimal Environment Setup (For Testing)

## Backend .env File

Create this file: `backend\.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/p2p-lending

# JWT Secret (Change this!)
JWT_SECRET=my_super_secret_jwt_key_for_development_12345

# Ethereum (Sepolia Testnet) - Optional for now
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY_HERE
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Email (Optional - will skip if not configured)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Twilio (Optional - will skip if not configured)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Razorpay (Optional for now)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# CoinGecko API
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

## Frontend .env File

Create this file: `p2p-lend\p2p-lend\.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=
```

---

## 🚀 Quick Copy Commands

### Backend:
```bash
cd C:\Users\yanda\Downloads\p2p-lend\backend
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo MONGODB_URI=mongodb://localhost:27017/p2p-lending >> .env
echo JWT_SECRET=my_super_secret_jwt_key_for_development_12345 >> .env
echo ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY_HERE >> .env
echo CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000 >> .env
echo COINGECKO_API_URL=https://api.coingecko.com/api/v3 >> .env
echo EMAIL_USER= >> .env
echo EMAIL_PASSWORD= >> .env
echo TWILIO_ACCOUNT_SID= >> .env
echo TWILIO_AUTH_TOKEN= >> .env
```

### Frontend:
```bash
cd C:\Users\yanda\Downloads\p2p-lend\p2p-lend\p2p-lend
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

---

## ✅ This Will Work Without:
- ❌ Twilio (SMS will be skipped)
- ❌ Email (Email will be skipped)
- ❌ Razorpay (Payment features disabled)
- ❌ Smart Contract (Can test basic features)

## ✅ You Can Still Test:
- ✅ MetaMask connection
- ✅ Wallet authentication
- ✅ Basic UI navigation
- ✅ Database operations

---

## 🎯 After Creating .env Files:

1. **Restart Backend:**
   ```bash
   cd C:\Users\yanda\Downloads\p2p-lend\backend
   npm run dev
   ```

2. **Restart Frontend:**
   ```bash
   cd C:\Users\yanda\Downloads\p2p-lend\p2p-lend\p2p-lend
   npm start
   ```

3. **Try MetaMask Connection Again**
