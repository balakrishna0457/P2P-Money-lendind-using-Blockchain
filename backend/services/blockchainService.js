const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load contract ABI
const contractABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../artifacts/contracts/P2PLending.sol/P2PLending.json'),
    'utf8'
  )
).abi;

// Initialize provider and contract
let provider, contract, wallet;

const initializeBlockchain = () => {
  try {
    provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
    console.log('Blockchain service initialized');
  } catch (error) {
    console.error('Blockchain initialization error:', error);
  }
};

// Create loan on blockchain
exports.createLoan = async (borrowerAddress, amount, interestRate, duration, totalInstallments, collateralType, friendWallet, physicalContacts) => {
  try {
    if (!contract) initializeBlockchain();

    const amountWei = ethers.parseEther(amount.toString());
    const collateralTypeEnum = collateralType === 'OwnETH' ? 0 : collateralType === 'FriendETH' ? 1 : 2;

    const tx = await contract.createLoan(
      amountWei,
      interestRate,
      duration,
      totalInstallments,
      collateralTypeEnum,
      friendWallet || ethers.ZeroAddress,
      physicalContacts || '',
      { value: collateralType === 'OwnETH' ? amountWei : 0 }
    );

    const receipt = await tx.wait();
    
    // Extract loan ID from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === 'LoanCreated';
      } catch (e) {
        return false;
      }
    });

    const parsedEvent = contract.interface.parseLog(event);
    const loanId = parsedEvent.args.loanId;

    return {
      success: true,
      txHash: receipt.hash,
      loanId: Number(loanId),
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Create loan error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Accept loan on blockchain
exports.acceptLoan = async (loanId, amount) => {
  try {
    if (!contract) initializeBlockchain();

    const amountWei = ethers.parseEther(amount.toString());
    const tx = await contract.acceptLoan(loanId, { value: amountWei });
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Accept loan error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Lock friend collateral
exports.lockFriendCollateral = async (loanId, amount, friendPrivateKey) => {
  try {
    if (!provider) initializeBlockchain();

    const friendWallet = new ethers.Wallet(friendPrivateKey, provider);
    const friendContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, friendWallet);

    const amountWei = ethers.parseEther(amount.toString());
    const tx = await friendContract.lockFriendCollateral(loanId, { value: amountWei });
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Lock friend collateral error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Pay installment
exports.payInstallment = async (loanId, amount, borrowerPrivateKey) => {
  try {
    if (!provider) initializeBlockchain();

    const borrowerWallet = new ethers.Wallet(borrowerPrivateKey, provider);
    const borrowerContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, borrowerWallet);

    const amountWei = ethers.parseEther(amount.toString());
    const tx = await borrowerContract.payInstallment(loanId, { value: amountWei });
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Pay installment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Mark as default
exports.markAsDefault = async (loanId) => {
  try {
    if (!contract) initializeBlockchain();

    const tx = await contract.markAsDefault(loanId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Mark default error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get loan details from blockchain
exports.getLoanDetails = async (loanId) => {
  try {
    if (!contract) initializeBlockchain();

    const loan = await contract.getLoan(loanId);
    return {
      success: true,
      loan: {
        loanId: Number(loan.loanId),
        borrower: loan.borrower,
        lender: loan.lender,
        amount: ethers.formatEther(loan.amount),
        interestRate: Number(loan.interestRate),
        duration: Number(loan.duration),
        installmentAmount: ethers.formatEther(loan.installmentAmount),
        totalInstallments: Number(loan.totalInstallments),
        paidInstallments: Number(loan.paidInstallments),
        status: Number(loan.status),
        collateralLocked: loan.collateralLocked
      }
    };
  } catch (error) {
    console.error('Get loan details error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Check if address is defaulter
exports.isDefaulter = async (address) => {
  try {
    if (!contract) initializeBlockchain();
    const isDefaulter = await contract.isDefaulter(address);
    return isDefaulter;
  } catch (error) {
    console.error('Check defaulter error:', error);
    return false;
  }
};

// Get credit score from blockchain
exports.getCreditScore = async (address) => {
  try {
    if (!contract) initializeBlockchain();
    const score = await contract.getCreditScore(address);
    return Number(score);
  } catch (error) {
    console.error('Get credit score error:', error);
    return 0;
  }
};

module.exports = exports;
