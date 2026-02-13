import React, { createContext, useState, useEffect } from 'react';
import { borrowAPI } from '../services/api';

export const BorrowContext = createContext();

export const BorrowProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all borrow requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await borrowAPI.getRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBorrowRequest = async (request) => {
    try {
      const response = await borrowAPI.createRequest(request);
      if (response.data.success) {
        setRequests((prev) => [response.data.borrowRequest, ...prev]);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create request:', error);
      throw error;
    }
  };

  const fulfillRequest = (requestId, lenderAddress) => {
    setRequests((prev) =>
      prev.map((req) =>
        req._id === requestId ? { ...req, status: 'active', lender: lenderAddress } : req
      )
    );
  };

  return (
    <BorrowContext.Provider value={{ requests, addBorrowRequest, fulfillRequest, fetchRequests, loading }}>
      {children}
    </BorrowContext.Provider>
  );
};
