import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyerPage from './products/Buyer';
import SellerDashboard from './seller/SellerDashboard';
import Login from './general/Login';
import Register from './general/Register';
import Footer from './Footer/Footer';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/buyerPage/*' element={<BuyerPage />} />
        <Route path='/sellerDashboard/*' element={<SellerDashboard />} />
        <Route path="/*" element={<BuyerPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
