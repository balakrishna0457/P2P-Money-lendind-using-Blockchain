# P2P Lending Platform - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📍 Endpoints

### Health Check

#### GET /health
Check API status

**Response:**
```json
{
  "status": "OK",
  "message": "P2P Lending API is running"
}
```

---

## 🔐 Authentication Routes

### GET /api/auth/nonce/:walletAddress
Get nonce for wallet signature

**Parameters:**
- `walletAddress` (string) - Ethereum wallet address

**Response:**
```json
{
  "nonce": "random_string_12345"
}
```

---

### POST /api/auth/connect-wallet
Connect wallet and authenticate

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x...",
  "message": "Sign this message to authenticate: nonce_12345"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "name": "John Doe",
    "email": "john@example.com",
    "creditScore": 750,
    "isVerified": true
  }
}
```

---

### POST /api/auth/logout
Logout user (Protected)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Routes

### GET /api/user/profile
Get user profile (Protected)

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "creditScore": 750,
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "isVerified": true,
    "totalBorrowed": 1.5,
    "totalLent": 0,
    "activeLoans": 1,
    "completedLoans": 2,
    "defaultedLoans": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT /api/user/profile
Update user profile (Protected)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

### POST /api/user/send-email-otp
Send OTP to email (Protected)

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

---

### POST /api/user/verify-email-otp
Verify email OTP (Protected)

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### POST /api/user/send-phone-otp
Send OTP to phone (Protected)

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to phone"
}
```

---

### POST /api/user/verify-phone-otp
Verify phone OTP (Protected)

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone verified successfully"
}
```

---

### GET /api/user/stats
Get user statistics (Protected)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBorrowed": 1.5,
    "totalLent": 2.0,
    "activeLoans": 1,
    "completedLoans": 2,
    "totalEarned": 0.15,
    "creditScore": 750
  }
}
```

---

## 💰 Borrow Routes

### POST /api/borrow/create-request
Create borrow request (Protected)

**Request Body:**
```json
{
  "amount": 0.5,
  "duration": 30,
  "totalInstallments": 3,
  "interestRate": 5,
  "collateralType": "OwnETH",
  "friendWallet": "0x...",
  "physicalContacts": "John: +123, Jane: +456",
  "purpose": "Business expansion"
}
```

**Collateral Types:**
- `OwnETH` - Lock own ETH as collateral
- `FriendETH` - Friend locks ETH
- `Physical` - Physical collateral with contacts

**Response:**
```json
{
  "success": true,
  "message": "Borrow request created successfully",
  "request": {
    "_id": "request_id",
    "borrower": "user_id",
    "amount": 0.5,
    "duration": 30,
    "totalInstallments": 3,
    "interestRate": 5,
    "collateralType": "OwnETH",
    "status": "pending",
    "blockchainLoanId": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### GET /api/borrow/requests
Get all borrow requests (Protected)

**Query Parameters:**
- `status` (optional) - Filter by status: pending, active, completed, defaulted, cancelled
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "_id": "request_id",
      "borrower": {
        "_id": "user_id",
        "name": "John Doe",
        "walletAddress": "0x...",
        "creditScore": 750
      },
      "amount": 0.5,
      "duration": 30,
      "totalInstallments": 3,
      "interestRate": 5,
      "collateralType": "OwnETH",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

---

### GET /api/borrow/my-requests
Get user's borrow requests (Protected)

**Response:**
```json
{
  "success": true,
  "requests": [ /* array of user's requests */ ]
}
```

---

### GET /api/borrow/request/:id
Get single borrow request (Protected)

**Parameters:**
- `id` - Request ID

**Response:**
```json
{
  "success": true,
  "request": { /* detailed request object */ }
}
```

---

### PUT /api/borrow/cancel/:id
Cancel borrow request (Protected)

**Parameters:**
- `id` - Request ID

**Response:**
```json
{
  "success": true,
  "message": "Request cancelled successfully"
}
```

---

### GET /api/borrow/installments/:loanId
Get installment schedule (Protected)

**Parameters:**
- `loanId` - Blockchain loan ID

**Response:**
```json
{
  "success": true,
  "installments": [
    {
      "installmentNumber": 0,
      "amount": 0.175,
      "dueDate": "2024-02-01T00:00:00.000Z",
      "paidDate": "2024-01-31T12:00:00.000Z",
      "isPaid": true
    }
  ]
}
```

---

## 🏦 Lend Routes

### POST /api/lend/accept-request/:id
Accept borrow request (Protected)

**Parameters:**
- `id` - Request ID

**Request Body:**
```json
{
  "interestRate": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Loan accepted successfully",
  "loan": { /* loan details */ }
}
```

---

### GET /api/lend/my-offers
Get lender's accepted loans (Protected)

**Response:**
```json
{
  "success": true,
  "offers": [ /* array of accepted loans */ ]
}
```

---

### GET /api/lend/history
Get lending history (Protected)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "_id": "loan_id",
      "borrower": { /* borrower details */ },
      "amount": 0.5,
      "interestRate": 5,
      "status": "completed",
      "paidInstallments": 3,
      "totalInstallments": 3,
      "totalEarned": 0.025
    }
  ]
}
```

---

### POST /api/lend/mark-default/:loanId
Mark loan as defaulted (Protected)

**Parameters:**
- `loanId` - Blockchain loan ID

**Response:**
```json
{
  "success": true,
  "message": "Loan marked as defaulted"
}
```

---

## 💳 Payment Routes

### GET /api/payment/exchange-rate
Get current ETH to INR exchange rate

**Response:**
```json
{
  "success": true,
  "rate": 150000,
  "currency": "INR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### POST /api/payment/convert-inr-to-eth
Convert INR amount to ETH (Protected)

**Request Body:**
```json
{
  "amountINR": 10000
}
```

**Response:**
```json
{
  "success": true,
  "amountINR": 10000,
  "amountETH": 0.0667,
  "exchangeRate": 150000
}
```

---

### POST /api/payment/create-order
Create Razorpay order (Protected)

**Request Body:**
```json
{
  "amountINR": 10000
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xyz123",
    "amount": 1000000,
    "currency": "INR",
    "amountETH": 0.0667
  }
}
```

---

### POST /api/payment/verify-payment
Verify Razorpay payment (Protected)

**Request Body:**
```json
{
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456",
  "signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and ETH credited",
  "amountETH": 0.0667
}
```

---

### POST /api/payment/pay-installment/:loanId
Pay loan installment (Protected)

**Parameters:**
- `loanId` - Blockchain loan ID

**Response:**
```json
{
  "success": true,
  "message": "Installment paid successfully",
  "installmentNumber": 1,
  "remainingInstallments": 2
}
```

---

### GET /api/payment/history
Get payment history (Protected)

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "payment_id",
      "type": "installment",
      "amount": 0.175,
      "loanId": 0,
      "status": "completed",
      "transactionHash": "0x...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📊 Credit Routes

### GET /api/credit/score
Get user's credit score (Protected)

**Response:**
```json
{
  "success": true,
  "creditScore": 750,
  "rating": "Good",
  "factors": {
    "onTimePayments": 10,
    "latePayments": 1,
    "completedLoans": 2,
    "defaultedLoans": 0
  }
}
```

**Credit Score Ranges:**
- 300-579: Poor
- 580-669: Fair
- 670-739: Good
- 740-799: Very Good
- 800-900: Excellent

---

### GET /api/credit/history
Get credit history (Protected)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "date": "2024-01-01T00:00:00.000Z",
      "action": "loan_completed",
      "scoreChange": +10,
      "newScore": 750,
      "description": "Loan completed successfully"
    }
  ]
}
```

---

### POST /api/credit/refresh
Refresh credit score (Protected)

**Response:**
```json
{
  "success": true,
  "message": "Credit score refreshed",
  "creditScore": 755
}
```

---

## 🔔 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data",
  "details": "Amount must be greater than 0"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Request not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## 📝 Notes

### Rate Limiting
- 100 requests per 15 minutes per IP
- Exceeding limit returns 429 Too Many Requests

### Pagination
Default pagination for list endpoints:
- `page`: 1
- `limit`: 10
- `maxLimit`: 100

### Date Format
All dates are in ISO 8601 format (UTC):
```
2024-01-01T00:00:00.000Z
```

### Amount Format
- ETH amounts: Decimal (e.g., 0.5)
- INR amounts: Integer (e.g., 10000)
- Interest rates: Basis points (e.g., 500 = 5%)

---

## 🧪 Testing with cURL

### Connect Wallet
```bash
curl -X POST http://localhost:5000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "signature": "0x...",
    "message": "Sign this message..."
  }'
```

### Get Profile
```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Borrow Request
```bash
curl -X POST http://localhost:5000/api/borrow/create-request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0.5,
    "duration": 30,
    "totalInstallments": 3,
    "interestRate": 5,
    "collateralType": "OwnETH"
  }'
```

---

## 🔗 Related Documentation

- [Setup Guide](SETUP_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Project Summary](PROJECT_SUMMARY.md)
