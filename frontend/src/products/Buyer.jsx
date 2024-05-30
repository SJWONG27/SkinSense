import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<Product />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ViewProduct />}/>
        <Route path="/chat" element={<Chat />} />
        <Route path="/shoppingcart" element={<ShoppingCart/>} />
        <Route path="/profilePage" element={<Profile/>} />
        <Route path="/transaction/*" element={<Transaction/>} />
        <Route path="/sellerDashboard/*" element={<SellerDashboard />} />
      </Routes>
    </div>
  );
}

export default Buyer;
