import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PlaceOrder from './PlaceOrder/PlaceOrder'
import Payment from './Payment/Payment'
import Success from './Success/Success'

function Transaction(){
  return (
    <div className='homeContainer'>
      <Routes>
        <Route path='checkout' element={<PlaceOrder/>} />
        <Route path='Payment' element={<Payment/>} />
        <Route path='Success' element={<Success/>} />
      </Routes>
    </div>
  );
}

export default Transaction;

