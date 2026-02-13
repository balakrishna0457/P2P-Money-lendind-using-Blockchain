# 🚀 Quick Setup and Run Guide

## Option 1: Automated Startup (Easiest)

### Just Double-Click This File:
```
START_PROJECT.bat
```

This will automatically:
- ✅ Check if Node.js is installed
- ✅ Install dependencies if needed
- ✅ Start MongoDB
- ✅ Start backend server
- ✅ Start frontend application
- ✅ Open browser to http://localhost:3000

---

## Option 2: Manual Startup

### Step 1: Install Dependencies (First Time Only)

**Backend:**
```bash
cd C:\Users\yanda\Downloads\p2p-lend\backend
npm install
```

**Frontend:**
```bash
cd C:\Users\yanda\Downloads\p2p-lend\p2p-lend\p2p-lend
npm install
```

### Step 2: Configure Environment (First Time Only)

**Backend .env:**
```bash
cd C:\Users\yanda\Downloads\p2p-lend\backend
copy .env.example .env
notepad .env
```

Minimum configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/p2p-lending
JWT_SECRET=my_super_secret_key_12345
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

**Frontend .env:**
```bash
cd C:\Users\yanda\Downloads\p2p-lend\p2p-lend\p2p-lend
copy .env.example .env
notepad .env
```

Configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB
```bash
net start MongoDB
```

### Step 4: Start Backend (Terminal 1)
```bash
cd C:\Users\yanda\Downloads\p2p-lend\backend
npm run dev
```

### Step 5: Start Frontend (Terminal 2 - New Window)
```bash
cd C:\Users\yanda\Downloads\p2p-lend\p2p-lend\p2p-lend
npm start
```

### Step 6: Open Browser
Go to: http://localhost:3000

---

## 🎯 What You'll See

### Backend Terminal:
```
Server running on port 5000
Environment: development
API available at http://localhost:5000
MongoDB connected successfully
```

### Frontend Terminal:
```
Compiled successfully!

You can now view p2p-lend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ Verify Everything is Working

### 1. Check Backend Health
Open: http://localhost:5000/health

Should see:
```json
{
  "status": "OK",
  "message": "P2P Lending API is running"
}
```

### 2. Check Frontend
Open: http://localhost:3000

Should see the P2P Lending Platform homepage

### 3. Check MongoDB
```bash
mongosh
use p2p-lending
show collections
```

---

## 🛑 How to Stop

1. **Close Backend Terminal** (or press Ctrl+C)
2. **Close Frontend Terminal** (or press Ctrl+C)
3. **Stop MongoDB** (optional):
   ```bash
   net stop MongoDB
   ```

---

## 🔧 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
npx kill-port 3000
```

### MongoDB Not Starting
```bash
# Check if MongoDB service exists
sc query MongoDB

# Start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Dependencies Issues
```bash
# Clear and reinstall
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

cd ..\p2p-lend\p2p-lend
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## 📱 Next Steps After Starting

1. **Install MetaMask** browser extension
2. **Switch to Sepolia Testnet** in MetaMask
3. **Get Test ETH** from https://sepoliafaucet.com
4. **Connect Wallet** on http://localhost:3000
5. **Start Testing** the platform!

---

## 📚 More Information

- **Full Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **API Documentation:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Ready to go! 🚀**
