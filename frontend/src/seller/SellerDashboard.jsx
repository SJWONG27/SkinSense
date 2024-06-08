import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './SideBar';
import Order from './Order';
import MyProduct from './MyProduct'; 
import AddProduct from './AddProduct'; 
import ChatManagement from './ChatManagement'; 
import Finance from './Finance'; 
import "./sellerIndex.css";
import { UserProvider } from '../general/UserContext';


const MainLayout = () => {
  return (
    <UserProvider>
    <div className="MainContainer">
      <div className="SidebarContainer">
        <SideBar />
      </div>
      <div className="MainContentContainer">
        <Routes>
          <Route path="*/Order" element={<Order />} />
          <Route path="*/MyProduct" element={<MyProduct />} />
          <Route path="*/AddProduct" element={<AddProduct />} />
          <Route path="*/ChatManagement" element={<ChatManagement />} />
          <Route path='/' element={<Order/>}/>
        </Routes>
      </div>
    </div>
    </UserProvider>
  );
};

function SellerDashboard() {
  return <MainLayout />;
}

export default SellerDashboard;
