import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { authAPI, userAPI } from '../services/api';

export const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedAddress = localStorage.getItem('walletAddress');
    
    if (token && savedAddress) {
      setWalletAddress(savedAddress);
      loadUserProfile();
    }
  }, []);

  // Load user profile
  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('walletAddress');
    }
  };

  // Update balance from blockchain
  const updateBalance = async (address) => {
    if (provider && address) {
      try {
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install MetaMask to use this application.');
      return;
    }

    setLoading(true);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const ethSigner = await ethProvider.getSigner();
      const address = await ethSigner.getAddress();

      // Get nonce from backend
      const nonceResponse = await authAPI.getNonce(address);
      const message = nonceResponse.data.message;

      // Sign message
      const signature = await ethSigner.signMessage(message);

      // Authenticate with backend
      const authResponse = await authAPI.connectWallet(address, signature, message);
      
      if (authResponse.data.success) {
        const { token, user } = authResponse.data;
        
        // Save token and address
        localStorage.setItem('authToken', token);
        localStorage.setItem('walletAddress', address);

        // Update state
        setProvider(ethProvider);
        setSigner(ethSigner);
        setWalletAddress(address);
        setUser(user);

        // Update balance
        await updateBalance(address);

        console.log('Wallet connected successfully');
      }
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear state
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
    setBalance(0);
    setUser(null);

    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        walletAddress,
        balance,
        user,
        loading,
        connectWallet,
        disconnectWallet,
        setBalance,
        updateBalance,
        loadUserProfile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
