@echo off
title P2P Lending Platform Startup
color 0A

echo ========================================
echo  P2P LENDING PLATFORM - STARTUP SCRIPT
echo ========================================
echo.

REM Check if Node.js is installed
echo [CHECK] Verifying Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

REM Check if MongoDB is installed
echo [CHECK] Verifying MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB not found in PATH
    echo Make sure MongoDB is installed and running
)
echo.

REM Check if backend node_modules exists
echo [CHECK] Checking backend dependencies...
if not exist "backend\node_modules" (
    echo [INFO] Backend dependencies not found. Installing...
    cd backend
    call npm install
    cd ..
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies found
)
echo.

REM Check if frontend node_modules exists
echo [CHECK] Checking frontend dependencies...
if not exist "p2p-lend\p2p-lend\node_modules" (
    echo [INFO] Frontend dependencies not found. Installing...
    cd p2p-lend\p2p-lend
    call npm install
    cd ..\..
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies found
)
echo.

REM Check if .env files exist
echo [CHECK] Checking environment configuration...
if not exist "backend\.env" (
    echo [WARNING] backend\.env not found!
    echo Please copy backend\.env.example to backend\.env and configure it
    echo.
    pause
)

if not exist "p2p-lend\p2p-lend\.env" (
    echo [WARNING] frontend\.env not found!
    echo Please copy p2p-lend\p2p-lend\.env.example to .env and configure it
    echo.
    pause
)
echo.

REM Start MongoDB
echo [STEP 1/3] Starting MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB started successfully
) else (
    echo [INFO] MongoDB may already be running or needs manual start
)
echo.

REM Start Backend Server
echo [STEP 2/3] Starting Backend Server...
echo [INFO] Opening new terminal for backend...
start "P2P Lending - Backend Server" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && npm run dev"
timeout /t 3 >nul
echo [OK] Backend server starting on http://localhost:5000
echo.

REM Start Frontend Application
echo [STEP 3/3] Starting Frontend Application...
echo [INFO] Opening new terminal for frontend...
start "P2P Lending - Frontend App" cmd /k "cd /d %~dp0p2p-lend\p2p-lend && echo Starting Frontend Application... && npm start"
timeout /t 3 >nul
echo [OK] Frontend application starting on http://localhost:3000
echo.

echo ========================================
echo  ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:3000
echo Health Check: http://localhost:5000/health
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo [INFO] Application opened in browser
echo [INFO] Keep the terminal windows open
echo.
echo To stop the servers:
echo 1. Close the backend terminal window
echo 2. Close the frontend terminal window
echo 3. Or press Ctrl+C in each terminal
echo.
pause
