import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Product from './Product';
import ViewProduct from './ViewProduct';
import SellerDashboard from '../seller/SellerDashboard';
import Profile from '../general/Profile';
import Chat from '../chatsupport/Chat';
import ShoppingCart from '../shoppingcart/ShoppingCart';
import Transaction from '../payment/Transaction';
import NavBar from '../NavBar';
import './product.css';

function Buyer() {
  return (
    <div className='mainHomeContainer'>
      <div className='navBarContainer'>
        <NavBar/>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/viewProduct" element={<ViewProduct />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/shoppingcart" element={<ShoppingCart/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/transaction/*" element={<Transaction/>} />
        <Route path="/sellerDashboard/*" element={<SellerDashboard />} />
      </Routes>
    </div>
  );
}

export default Buyer;
