# P2P Lending Platform - Testing Guide

## 🧪 Complete Testing Checklist

### Prerequisites for Testing
- [ ] MetaMask installed and configured
- [ ] Sepolia testnet ETH in wallet (get from https://sepoliafaucet.com)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB running locally or connected to Atlas
- [ ] Smart contract deployed to Sepolia testnet

---

## 1. Environment Setup Testing

### Backend Environment
```bash
cd backend
# Verify all environment variables are set
node -e "require('dotenv').config(); console.log('✓ PORT:', process.env.PORT); console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing'); console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing'); console.log('✓ CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? 'Set' : 'Missing');"
```

### Frontend Environment
```bash
cd p2p-lend/p2p-lend
# Check .env file exists
cat .env
```

### Database Connection
```bash
# Test MongoDB connection
mongosh
use p2p-lending
db.stats()
```

---

## 2. Smart Contract Testing

### Compile Contract
```bash
cd backend
npx hardhat compile
# Expected: Compilation successful
```

### Test Contract Functions
```bash
npx hardhat test
# Expected: All tests pass
```

### Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
# Expected: Contract address returned
# Copy address to .env as CONTRACT_ADDRESS
```

### Verify Deployment
```bash
# Check contract on Sepolia Etherscan
# Visit: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

## 3. Backend API Testing

### Health Check
```bash
curl http://localhost:5000/health
# Expected: {"status":"OK","message":"P2P Lending API is running"}
```

### Test Authentication Flow

#### Step 1: Get Nonce
```bash
curl http://localhost:5000/api/auth/nonce/0xYourWalletAddress
# Expected: {"nonce":"random_string"}
```

#### Step 2: Connect Wallet (Use Postman/Thunder Client)
```json
POST http://localhost:5000/api/auth/connect-wallet
{
  "walletAddress": "0xYourAddress",
  "signature": "signed_message",
  "message": "nonce_message"
}
# Expected: {"token":"jwt_token","user":{...}}
```

### Test Protected Routes
```bash
# Use JWT token from login
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/user/profile
# Expected: User profile data
```

---

## 4. Frontend Testing

### Manual Testing Checklist

#### 4.1 Wallet Connection
- [ ] Open http://localhost:3000
- [ ] Click "Connect Wallet" button
- [ ] MetaMask popup appears
- [ ] Select account and connect
- [ ] Sign authentication message
- [ ] Wallet address displayed in UI
- [ ] User redirected to dashboard

#### 4.2 Profile Setup & Verification
- [ ] Navigate to Profile/Settings
- [ ] Enter name, email, phone number
- [ ] Click "Send Email OTP"
- [ ] Check email inbox for OTP
- [ ] Enter OTP and verify
- [ ] Click "Send Phone OTP"
- [ ] Check phone for SMS
- [ ] Enter OTP and verify
- [ ] Profile marked as verified

#### 4.3 Wallet Funding (INR to ETH)
- [ ] Navigate to "Fund Wallet" section
- [ ] Enter INR amount (e.g., 1000)
- [ ] View ETH equivalent
- [ ] Click "Pay with Razorpay"
- [ ] Complete test payment
- [ ] Verify ETH credited to wallet
- [ ] Check transaction in payment history

#### 4.4 Create Borrow Request
- [ ] Navigate to "Borrow" section
- [ ] Fill borrow form:
  - Amount: 0.1 ETH
  - Duration: 30 days
  - Installments: 3
  - Interest Rate: 5%
- [ ] Select collateral type: "Own ETH"
- [ ] Submit request
- [ ] MetaMask prompts for transaction
- [ ] Confirm transaction
- [ ] Request appears in "My Requests"
- [ ] Request visible to all lenders

#### 4.5 Accept Loan (Lender Flow)
- [ ] Switch to different MetaMask account
- [ ] Connect as lender
- [ ] Navigate to "Browse Requests"
- [ ] View borrower's credit score
- [ ] Click "Accept Request"
- [ ] Set interest rate
- [ ] Confirm transaction in MetaMask
- [ ] Loan becomes active
- [ ] Borrower receives funds

#### 4.6 Pay Installment
- [ ] Switch back to borrower account
- [ ] Navigate to "Active Loans"
- [ ] View installment schedule
- [ ] Click "Pay Installment"
- [ ] Confirm transaction
- [ ] Installment marked as paid
- [ ] Credit score updated

#### 4.7 Complete Loan
- [ ] Pay all remaining installments
- [ ] Loan status changes to "Completed"
- [ ] Collateral released
- [ ] Credit score increased
- [ ] View loan in history

#### 4.8 Test Default Scenario
- [ ] Create new loan
- [ ] Accept as lender
- [ ] Wait past due date + 7 days grace period
- [ ] Lender marks as default
- [ ] Collateral transferred to lender
- [ ] Borrower marked as defaulter
- [ ] Credit score decreased

#### 4.9 Friend Collateral Testing
- [ ] Create loan with "Friend ETH" option
- [ ] Enter friend's wallet address
- [ ] Friend connects wallet
- [ ] Friend locks collateral
- [ ] Lender accepts loan
- [ ] Complete repayment
- [ ] Collateral returned to friend

#### 4.10 Physical Collateral Testing
- [ ] Create loan with "Physical" option
- [ ] Enter trusted contacts
- [ ] Lender accepts (higher risk)
- [ ] Complete repayment flow

---

## 5. Automated Testing

### Backend Unit Tests
```bash
cd backend
npm test
```

### Frontend Component Tests
```bash
cd p2p-lend/p2p-lend
npm test
```

---

## 6. Security Testing

### Test Cases
- [ ] Try accessing protected routes without token
- [ ] Try manipulating JWT token
- [ ] Test SQL injection in inputs
- [ ] Test XSS attacks in form fields
- [ ] Verify signature validation works
- [ ] Test rate limiting (if implemented)
- [ ] Check CORS configuration
- [ ] Verify password/key encryption

### Smart Contract Security
- [ ] Test reentrancy protection
- [ ] Verify access control modifiers
- [ ] Test overflow/underflow scenarios
- [ ] Check collateral locking mechanism
- [ ] Test default marking conditions

---

## 7. Performance Testing

### Load Testing
```bash
# Install Apache Bench
ab -n 1000 -c 10 http://localhost:5000/health

# Expected: All requests successful
```

### Database Performance
```bash
# Check query performance
mongosh
use p2p-lending
db.borrowrequests.find().explain("executionStats")
```

---

## 8. Integration Testing

### End-to-End Flow
1. **User Registration**
   - Connect wallet → Verify profile → Fund wallet
   
2. **Borrowing Flow**
   - Create request → Wait for lender → Receive funds
   
3. **Lending Flow**
   - Browse requests → Check credit → Accept loan
   
4. **Repayment Flow**
   - Pay installments → Complete loan → Release collateral
   
5. **Default Flow**
   - Miss payment → Grace period → Mark default → Claim collateral

---

## 9. Cross-Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## 10. Error Handling Testing

### Test Scenarios
- [ ] Network disconnection during transaction
- [ ] MetaMask rejection
- [ ] Insufficient gas fees
- [ ] Invalid form inputs
- [ ] Expired OTP
- [ ] Database connection failure
- [ ] Smart contract revert scenarios

---

## 11. Cron Job Testing

### Test Overdue Detection
```bash
# Manually trigger cron job
node -e "require('./backend/server.js')"
# Check logs for overdue detection
```

### Test Payment Reminders
```bash
# Check email/SMS delivery
# Verify reminder sent 3 days before due date
```

---

## 12. Deployment Testing

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Smart contract verified on Etherscan
- [ ] API documentation updated
- [ ] Error logging configured
- [ ] Monitoring setup (optional)

### Staging Environment
- [ ] Deploy to staging
- [ ] Run full test suite
- [ ] Verify all features work
- [ ] Test with real users

### Production Deployment
- [ ] Deploy smart contract to mainnet
- [ ] Update frontend with mainnet contract
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure production environment variables
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring and alerts

---

## 13. Post-Deployment Testing

- [ ] Verify all endpoints accessible
- [ ] Test wallet connection on production
- [ ] Create test loan on mainnet
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify email/SMS delivery
- [ ] Test payment gateway

---

## 🐛 Common Issues & Solutions

### Issue: MetaMask not connecting
**Solution:** 
- Clear browser cache
- Reset MetaMask
- Check network is Sepolia

### Issue: Transaction failing
**Solution:**
- Check gas fees
- Verify sufficient ETH balance
- Check contract address is correct

### Issue: OTP not received
**Solution:**
- Check email/phone credentials
- Verify Twilio/Gmail settings
- Check spam folder

### Issue: Database connection error
**Solution:**
- Verify MongoDB is running
- Check connection string
- Verify network access

---

## 📊 Test Coverage Goals

- Backend API: 80%+
- Smart Contracts: 90%+
- Frontend Components: 70%+
- Integration Tests: 100% of critical paths

---

## 📝 Test Reporting

Create test reports with:
- Total tests run
- Pass/fail count
- Coverage percentage
- Performance metrics
- Security audit results

---

## 🎯 Success Criteria

✅ All unit tests passing  
✅ All integration tests passing  
✅ No critical security vulnerabilities  
✅ Performance meets requirements  
✅ All user flows working end-to-end  
✅ Error handling works correctly  
✅ Documentation is complete  

---

## 📞 Support

For testing issues, refer to:
- `PROJECT_SUMMARY.md` - Project overview
- `SETUP_GUIDE.md` - Setup instructions
- `README.md` - Quick start guide
