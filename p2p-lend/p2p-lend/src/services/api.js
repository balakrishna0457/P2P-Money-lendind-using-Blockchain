import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  getNonce: (walletAddress) => api.get(`/auth/nonce/${walletAddress}`),
  connectWallet: (walletAddress, signature, message) => 
    api.post('/auth/connect-wallet', { walletAddress, signature, message }),
  logout: () => api.post('/auth/logout')
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  sendEmailOTP: (email) => api.post('/user/send-email-otp', { email }),
  verifyEmailOTP: (otp) => api.post('/user/verify-email-otp', { otp }),
  sendPhoneOTP: (phone) => api.post('/user/send-phone-otp', { phone }),
  verifyPhoneOTP: (otp) => api.post('/user/verify-phone-otp', { otp }),
  getStats: () => api.get('/user/stats')
};

// Borrow APIs
export const borrowAPI = {
  createRequest: (data) => api.post('/borrow/create-request', data),
  getRequests: () => api.get('/borrow/requests'),
  getMyRequests: () => api.get('/borrow/my-requests'),
  getRequest: (id) => api.get(`/borrow/request/${id}`),
  cancelRequest: (id) => api.put(`/borrow/cancel/${id}`),
  getInstallments: (loanId) => api.get(`/borrow/installments/${loanId}`)
};

// Lend APIs
export const lendAPI = {
  acceptRequest: (requestId, interestRate) => 
    api.post(`/lend/accept-request/${requestId}`, { interestRate }),
  getMyOffers: () => api.get('/lend/my-offers'),
  getHistory: () => api.get('/lend/history'),
  markDefault: (loanId) => api.post(`/lend/mark-default/${loanId}`)
};

// Payment APIs
export const paymentAPI = {
  getExchangeRate: () => api.get('/payment/exchange-rate'),
  convertINRtoETH: (amountINR) => api.post('/payment/convert-inr-to-eth', { amountINR }),
  createOrder: (amountINR) => api.post('/payment/create-order', { amountINR }),
  verifyPayment: (orderId, paymentId, signature) => 
    api.post('/payment/verify-payment', { orderId, paymentId, signature }),
  payInstallment: (loanId) => api.post(`/payment/pay-installment/${loanId}`),
  getHistory: () => api.get('/payment/history')
};

// Credit APIs
export const creditAPI = {
  getScore: () => api.get('/credit/score'),
  getHistory: () => api.get('/credit/history'),
  refreshScore: () => api.post('/credit/refresh')
};

export default api;
