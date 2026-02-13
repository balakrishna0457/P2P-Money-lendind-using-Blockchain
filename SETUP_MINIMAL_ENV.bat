@echo off
title Setup Minimal Environment
color 0A

echo ========================================
echo  CREATING MINIMAL ENVIRONMENT FILES
echo ========================================
echo.

REM Create backend .env
echo [1/2] Creating backend\.env...
(
echo PORT=5000
echo NODE_ENV=development
echo.
echo # MongoDB
echo MONGODB_URI=mongodb://localhost:27017/p2p-lending
echo.
echo # JWT Secret
echo JWT_SECRET=my_super_secret_jwt_key_for_development_12345
echo.
echo # Ethereum - Optional for basic testing
echo ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY_HERE
echo CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
echo PRIVATE_KEY=
echo.
echo # Email - Optional, will skip if empty
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=
echo EMAIL_PASSWORD=
echo.
echo # Twilio - Optional, will skip if empty
echo TWILIO_ACCOUNT_SID=
echo TWILIO_AUTH_TOKEN=
echo TWILIO_PHONE_NUMBER=
echo.
echo # Razorpay - Optional
echo RAZORPAY_KEY_ID=
echo RAZORPAY_KEY_SECRET=
echo.
echo # CoinGecko API
echo COINGECKO_API_URL=https://api.coingecko.com/api/v3
) > backend\.env

echo [OK] backend\.env created
echo.

REM Create frontend .env
echo [2/2] Creating frontend\.env...
(
echo REACT_APP_API_URL=http://localhost:5000/api
echo REACT_APP_RAZORPAY_KEY_ID=
) > p2p-lend\p2p-lend\.env

echo [OK] frontend\.env created
echo.

echo ========================================
echo  ENVIRONMENT FILES CREATED SUCCESSFULLY!
echo ========================================
echo.
echo Files created:
echo   - backend\.env
echo   - p2p-lend\p2p-lend\.env
echo.
echo These are minimal configurations for testing.
echo Email and SMS features will be skipped.
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run START_PROJECT.bat
echo.
pause
