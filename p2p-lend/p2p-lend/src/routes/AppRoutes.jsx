import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../modules/Dashboard/Dashboard';
import ETHLending from '../modules/ETHLending/ETHLending';
import BorrowETH from '../modules/BorrowETH/BorrowETH';
import BorrowRequests from '../modules/BorrowRequests/BorrowRequests';
import LenderHistory from '../modules/LenderHistory/LenderHistory';

const AppRoutes = () => {
  const [lendingOffers, setLendingOffers] = useState([]);
  const [projectBalance, setProjectBalance] = useState(5000);

  const handleNewOffer = (offer) => {
    setLendingOffers((prev) => [...prev, offer]);
    setProjectBalance((prev) => prev - parseFloat(offer.amount));
  };

  return (
    <Routes>
      <Route path="/" element={<Dashboard lendingOffers={lendingOffers} projectBalance={projectBalance} />} />
      <Route path="/eth-lending" element={<ETHLending onSubmitOffer={handleNewOffer} projectBalance={projectBalance} />} />
      <Route path="/borrow" element={<BorrowETH projectBalance={projectBalance} lendingOffers={lendingOffers} />} />
      <Route path="/borrow-requests" element={<BorrowRequests />} />
      <Route path="/lender-history" element={<LenderHistory lendingOffers={lendingOffers} />} />
    </Routes>
  );
};

export default AppRoutes;
