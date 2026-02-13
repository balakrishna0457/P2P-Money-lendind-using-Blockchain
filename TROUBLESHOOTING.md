# Troubleshooting Guide

Common issues and solutions for the P2P Lending Platform.

## 🔧 Installation Issues

### npm install fails

**Problem:** Dependencies fail to install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Python/node-gyp errors

**Problem:** Native module compilation fails

**Solutions:**
- **Windows:** Install Visual Studio Build Tools
  ```bash
  npm install --global windows-build-tools
  ```
- **Mac:** Install Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- **Linux:** Install build essentials
  ```bash
  sudo apt-get install build-essential
  ```

---

## 🗄️ Database Issues

### MongoDB connection failed

**Problem:** Cannot connect to MongoDB

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```

2. **Verify connection string:**
   ```env
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/p2p-lending
   
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p2p-lending
   ```

3. **Check firewall/network:**
   - Whitelist IP in MongoDB Atlas
   - Check local firewall settings
   - Verify port 27017 is open

### Database authentication failed

**Problem:** Authentication error connecting to MongoDB

**Solutions:**
- Verify username and password
- Check database user permissions
- Ensure user has read/write access
- Try encoding special characters in password

---

## 🔐 Authentication Issues

### MetaMask not detected

**Problem:** "MetaMask not found" error

**Solutions:**
1. Install MetaMask extension
2. Refresh browser page
3. Enable MetaMask in browser extensions
4. Try different browser
5. Check browser console for errors

### Wallet connection fails

**Problem:** Cannot connect wallet

**Solutions:**
1. **Check MetaMask network:**
   - Switch to Sepolia testnet
   - Add network manually if needed

2. **Clear MetaMask cache:**
   - Settings → Advanced → Reset Account

3. **Check browser console:**
   ```javascript
   // Should see window.ethereum
   console.log(window.ethereum);
   ```

### Signature verification fails

**Problem:** "Invalid signature" error

**Solutions:**
- Ensure correct message is signed
- Check wallet address matches
- Verify nonce is current
- Clear browser cache and retry

### JWT token expired

**Problem:** "Token expired" or 401 errors

**Solutions:**
```javascript
// Clear token and reconnect
localStorage.removeItem('authToken');
// Reconnect wallet
```

---

## 💰 Smart Contract Issues

### Contract deployment fails

**Problem:** Deployment transaction fails

**Solutions:**

1. **Check gas fees:**
   ```javascript
   // Increase gas limit in hardhat.config.js
   gas: 5000000
   ```

2. **Verify RPC URL:**
   ```env
   ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   ```

3. **Check wallet balance:**
   - Ensure sufficient ETH for gas
   - Get testnet ETH from faucet

4. **Verify private key:**
   - Check format (with or without 0x)
   - Ensure key has permissions

### Transaction fails with "insufficient funds"

**Problem:** Not enough ETH for transaction

**Solutions:**
1. Get testnet ETH from faucet:
   - https://sepoliafaucet.com
   - https://faucet.sepolia.dev

2. Check gas price:
   ```bash
   # View current gas price
   npx hardhat console --network sepolia
   > await ethers.provider.getGasPrice()
   ```

### Contract interaction fails

**Problem:** Cannot call contract functions

**Solutions:**

1. **Verify contract address:**
   ```env
   CONTRACT_ADDRESS=0x... # Must match deployed contract
   ```

2. **Check ABI is updated:**
   ```bash
   npx hardhat compile
   # Copy new ABI to frontend if needed
   ```

3. **Verify network:**
   - Frontend and contract on same network
   - MetaMask on correct network

### "Nonce too high" error

**Problem:** Transaction nonce mismatch

**Solutions:**
- Reset MetaMask account
- Settings → Advanced → Reset Account
- This clears transaction history

---

## 🌐 API Issues

### Backend server won't start

**Problem:** Server fails to start

**Solutions:**

1. **Check port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. **Kill process on port:**
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # Mac/Linux
   kill -9 <PID>
   ```

3. **Verify environment variables:**
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.PORT)"
   ```

### CORS errors

**Problem:** "CORS policy" errors in browser

**Solutions:**

1. **Update CORS configuration:**
   ```javascript
   // server.js
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Check API URL:**
   ```env
   # Frontend .env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### API returns 404

**Problem:** Route not found

**Solutions:**
- Verify route exists in backend
- Check API base URL is correct
- Ensure route is registered in server.js
- Check for typos in endpoint path

### API returns 500

**Problem:** Internal server error

**Solutions:**
1. Check backend console logs
2. Verify database connection
3. Check all environment variables
4. Review error stack trace
5. Test endpoint with Postman

---

## 📧 OTP Issues

### Email OTP not received

**Problem:** OTP email not arriving

**Solutions:**

1. **Check spam folder**

2. **Verify email configuration:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password # Not regular password!
   ```

3. **Generate Gmail App Password:**
   - Enable 2FA on Google account
   - Go to App Passwords
   - Generate new password
   - Use this in EMAIL_PASSWORD

4. **Check backend logs:**
   ```bash
   # Look for email sending errors
   npm run dev
   ```

### SMS OTP not received

**Problem:** SMS not arriving

**Solutions:**

1. **Verify Twilio configuration:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

2. **Check Twilio dashboard:**
   - Verify account is active
   - Check SMS logs
   - Ensure phone number is verified (trial accounts)

3. **Phone number format:**
   ```
   Correct: +1234567890
   Wrong: 1234567890
   ```

### OTP expired

**Problem:** "OTP expired" error

**Solutions:**
- OTP valid for 10 minutes
- Request new OTP
- Check system time is correct

---

## 💳 Payment Issues

### Razorpay order creation fails

**Problem:** Cannot create payment order

**Solutions:**

1. **Verify Razorpay credentials:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```

2. **Check test mode:**
   - Use test keys for development
   - Use live keys for production

3. **Verify amount:**
   - Amount must be in paise (multiply by 100)
   - Minimum amount: ₹1

### Payment verification fails

**Problem:** Payment verification error

**Solutions:**
- Check signature calculation
- Verify order ID matches
- Ensure payment ID is correct
- Check Razorpay webhook logs

### Exchange rate not updating

**Problem:** ETH price not fetching

**Solutions:**

1. **Check CoinGecko API:**
   ```bash
   curl https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr
   ```

2. **Verify API URL:**
   ```env
   COINGECKO_API_URL=https://api.coingecko.com/api/v3
   ```

3. **Check rate limiting:**
   - CoinGecko has rate limits
   - Implement caching if needed

---

## 🎨 Frontend Issues

### Frontend won't start

**Problem:** React app fails to start

**Solutions:**

1. **Clear cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

2. **Check port 3000:**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Blank page after build

**Problem:** Production build shows blank page

**Solutions:**

1. **Check browser console for errors**

2. **Verify build configuration:**
   ```json
   // package.json
   "homepage": "."
   ```

3. **Check routing:**
   - Use HashRouter for static hosting
   - Or configure server for SPA

### MetaMask popup blocked

**Problem:** MetaMask window doesn't open

**Solutions:**
- Allow popups in browser
- Click MetaMask extension manually
- Refresh page and retry

---

## 🐛 Common Error Messages

### "Cannot read property of undefined"

**Cause:** Accessing property on undefined object

**Solutions:**
- Add null checks
- Use optional chaining (?.)
- Ensure data is loaded before rendering

### "Network Error"

**Cause:** Cannot reach backend API

**Solutions:**
- Check backend is running
- Verify API URL is correct
- Check CORS configuration
- Verify network connectivity

### "Transaction reverted"

**Cause:** Smart contract function failed

**Solutions:**
- Check require() conditions in contract
- Verify sufficient gas
- Ensure correct parameters
- Check contract state

### "Invalid address"

**Cause:** Ethereum address format incorrect

**Solutions:**
- Ensure address starts with 0x
- Verify address is 42 characters
- Use ethers.utils.getAddress() to validate

---

## 🔍 Debugging Tips

### Backend Debugging

```javascript
// Add detailed logging
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Error:', error.message);

// Use debugger
debugger;

// Check environment
console.log('Environment:', process.env.NODE_ENV);
```

### Frontend Debugging

```javascript
// React DevTools
// Install React DevTools extension

// Console logging
console.log('State:', state);
console.log('Props:', props);

// Network tab
// Check API calls in browser DevTools

// MetaMask debugging
console.log('Ethereum:', window.ethereum);
console.log('Accounts:', await window.ethereum.request({ method: 'eth_accounts' }));
```

### Smart Contract Debugging

```bash
# Hardhat console
npx hardhat console --network sepolia

# Check contract
const Contract = await ethers.getContractFactory("P2PLending");
const contract = await Contract.attach("CONTRACT_ADDRESS");
await contract.loanCounter();

# View transaction
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 📞 Getting Help

If issues persist:

1. **Check documentation:**
   - README.md
   - SETUP_GUIDE.md
   - API_DOCUMENTATION.md

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow

3. **Enable debug mode:**
   ```env
   NODE_ENV=development
   DEBUG=*
   ```

4. **Collect information:**
   - Error messages
   - Console logs
   - Steps to reproduce
   - Environment details

5. **Create issue:**
   - Provide all collected information
   - Include code snippets
   - Attach screenshots

---

## 🎯 Prevention Tips

- Keep dependencies updated
- Use environment variables
- Implement error handling
- Add logging
- Test thoroughly
- Monitor production
- Backup database regularly
- Document changes

---

**Still stuck? Check our [GitHub Issues](https://github.com/yourusername/p2p-lend/issues) or create a new one!**
