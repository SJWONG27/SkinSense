import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyerPage from './products/Buyer';
import SellerDashboard from './seller/SellerDashboard';
import Login from './general/Login';
import Register from './general/Register';
import Footer from './Footer/Footer';
import ForgotPassword from './general/ForgotPassword';
import ResetPassword from './general/ResetPassword';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path='/buyerPage/*' element={<BuyerPage />} />
        <Route path='/sellerDashboard/*' element={<SellerDashboard />} />
        <Route path="/*" element={<BuyerPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
