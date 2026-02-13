# P2P Lending Platform - Deployment Checklist

## 🚀 Pre-Deployment Checklist

### 1. Code Quality & Testing
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] Error handling implemented everywhere
- [ ] Input validation on all forms
- [ ] Security audit completed

### 2. Environment Configuration
- [ ] Production environment variables set
- [ ] API keys secured (not in code)
- [ ] Database credentials secured
- [ ] JWT secret is strong and unique
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled

### 3. Smart Contract
- [ ] Contract audited for security
- [ ] Deployed to mainnet (or testnet for staging)
- [ ] Contract verified on Etherscan
- [ ] Contract address documented
- [ ] Ownership transferred if needed

### 4. Database
- [ ] Production database created
- [ ] Indexes created for performance
- [ ] Backup strategy implemented
- [ ] Connection pooling configured
- [ ] Data migration scripts ready

### 5. Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] User guide available
- [ ] Deployment guide written
- [ ] Troubleshooting guide available

---

## 📦 Backend Deployment

### Option 1: Deploy to Heroku

#### Step 1: Prepare Application
```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Ensure package.json has start script
# "start": "node server.js"
```

#### Step 2: Deploy
```bash
# Login to Heroku
heroku login

# Create app
heroku create p2p-lending-backend

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set ETHEREUM_RPC_URL="your_infura_mainnet_url"
heroku config:set PRIVATE_KEY="your_private_key"
heroku config:set CONTRACT_ADDRESS="deployed_contract_address"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER="your_email@gmail.com"
heroku config:set EMAIL_PASSWORD="your_app_password"
heroku config:set TWILIO_ACCOUNT_SID="your_twilio_sid"
heroku config:set TWILIO_AUTH_TOKEN="your_twilio_token"
heroku config:set TWILIO_PHONE_NUMBER="your_twilio_number"
heroku config:set RAZORPAY_KEY_ID="your_razorpay_key"
heroku config:set RAZORPAY_KEY_SECRET="your_razorpay_secret"
heroku config:set COINGECKO_API_URL="https://api.coingecko.com/api/v3"

# Deploy
git add .
git commit -m "Prepare for deployment"
git push heroku main

# Check logs
heroku logs --tail
```

### Option 2: Deploy to Railway

#### Step 1: Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

#### Step 2: Configure
```bash
# Link to project
railway link

# Set environment variables (use Railway dashboard)
# Or via CLI:
railway variables set PORT=5000
railway variables set NODE_ENV=production
# ... (set all other variables)
```

#### Step 3: Deploy
```bash
railway up
```

### Option 3: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

#### Step 1: Server Setup
```bash
# SSH into server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

#### Step 2: Deploy Application
```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/p2p-lend.git
cd p2p-lend/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# (paste all environment variables)

# Start with PM2
pm2 start server.js --name p2p-lending-backend
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx
```bash
nano /etc/nginx/sites-available/p2p-lending

# Add configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/p2p-lending /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 4: Setup SSL
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel

#### Step 1: Prepare
```bash
cd p2p-lend/p2p-lend

# Update .env for production
echo "REACT_APP_API_URL=https://api.yourdomain.com/api" > .env.production
echo "REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key" >> .env.production
```

#### Step 2: Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Or via CLI:
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_RAZORPAY_KEY_ID production

# Deploy to production
vercel --prod
```

### Option 2: Deploy to Netlify

#### Step 1: Build
```bash
cd p2p-lend/p2p-lend
npm run build
```

#### Step 2: Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=build

# Or use Netlify dashboard:
# 1. Drag and drop 'build' folder
# 2. Set environment variables
# 3. Deploy
```

### Option 3: Deploy to VPS with Nginx

#### Step 1: Build Application
```bash
cd p2p-lend/p2p-lend
npm run build
```

#### Step 2: Transfer to Server
```bash
# From local machine
scp -r build/* root@your_server_ip:/var/www/p2p-lending-frontend/
```

#### Step 3: Configure Nginx
```bash
# On server
nano /etc/nginx/sites-available/p2p-lending-frontend

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/p2p-lending-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/p2p-lending-frontend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔗 Smart Contract Deployment to Mainnet

### Step 1: Prepare for Mainnet
```bash
cd backend

# Update hardhat.config.js for mainnet
nano hardhat.config.js
```

Add mainnet configuration:
```javascript
mainnet: {
  url: process.env.MAINNET_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 1
}
```

### Step 2: Get Mainnet ETH
- Purchase ETH from exchange
- Transfer to deployment wallet
- Ensure sufficient ETH for gas fees

### Step 3: Deploy
```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Save contract address
# Update .env files with new address
```

### Step 4: Verify Contract
```bash
# Get Etherscan API key
# Add to hardhat.config.js

# Verify
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create Cluster
1. Go to https://cloud.mongodb.com
2. Create new cluster
3. Choose region close to your backend
4. Select free tier or paid plan

#### Step 2: Configure
1. Create database user
2. Whitelist IP addresses (or 0.0.0.0/0 for all)
3. Get connection string
4. Update MONGODB_URI in environment variables

#### Step 3: Setup Indexes
```javascript
// Connect to MongoDB
mongosh "your_connection_string"

use p2p-lending

// Create indexes
db.users.createIndex({ walletAddress: 1 }, { unique: true })
db.borrowrequests.createIndex({ status: 1 })
db.borrowrequests.createIndex({ borrower: 1 })
db.borrowrequests.createIndex({ lender: 1 })
db.transactions.createIndex({ loanId: 1 })
db.transactions.createIndex({ createdAt: -1 })
```

---

## 🔐 Security Hardening

### Backend Security
```bash
# Install security packages
npm install helmet express-rate-limit express-mongo-sanitize xss-clean hpp
```

Update `server.js`:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
```

### Environment Variables
- Never commit .env files
- Use strong, random secrets
- Rotate keys regularly
- Use different keys for dev/staging/prod

### HTTPS/SSL
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use valid SSL certificates

---

## 📊 Monitoring & Logging

### Setup Logging
```bash
npm install winston morgan
```

Create `utils/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Monitoring Services (Optional)
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **LogRocket** - Frontend monitoring
- **Datadog** - Infrastructure monitoring

---

## 🧪 Post-Deployment Testing

### Smoke Tests
- [ ] Homepage loads
- [ ] API health check responds
- [ ] Wallet connection works
- [ ] Can create account
- [ ] Can create loan request
- [ ] Email/SMS notifications work
- [ ] Payment gateway works
- [ ] Smart contract interactions work

### Performance Tests
```bash
# Load testing
ab -n 1000 -c 50 https://api.yourdomain.com/health
```

### Security Tests
- [ ] SSL certificate valid
- [ ] HTTPS redirect works
- [ ] Security headers present
- [ ] No sensitive data in responses
- [ ] Rate limiting active

---

## 🔄 Continuous Deployment

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "p2p-lending-backend"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./p2p-lend/p2p-lend
```

---

## 📋 Rollback Plan

### If Deployment Fails
1. Revert to previous version
2. Check error logs
3. Fix issues in staging
4. Re-deploy

### Backup Strategy
- Daily database backups
- Keep last 7 days of backups
- Store backups in separate location
- Test restore process monthly

---

## ✅ Final Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Support channels ready
- [ ] Marketing materials ready

### After Going Live
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Monitor user feedback
- [ ] Be ready for hotfixes

---

## 📞 Emergency Contacts

- **DevOps Lead:** [Contact]
- **Backend Developer:** [Contact]
- **Frontend Developer:** [Contact]
- **Security Team:** [Contact]
- **Database Admin:** [Contact]

---

## 🎉 Success!

Your P2P Lending Platform is now live! 🚀

Monitor closely for the first 24-48 hours and be ready to respond to any issues quickly.
