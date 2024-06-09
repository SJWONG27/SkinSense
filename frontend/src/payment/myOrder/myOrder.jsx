import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../general/UserContext';
import axios from 'axios';
import './myOrder.css'; // Import the CSS file

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext); // Get the logged-in user's info

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      try {
        console.log('Fetching orders for user:', userId);
        const response = await axios.get(`http://localhost:4000/orders?userId=${userId}`);
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className='MyOrder'>
      <header className='header'>
        <h1>Orders</h1>
      </header>
      <div className='ordertable'>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Created At</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Payment Method</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order.itemName}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>${order.price ? order.price.toFixed(2) : '0.00'}</td>
                  <td>{order.quantity || '0'}</td>
                  <td>${(order.price * order.quantity).toFixed(2)}</td>
                  <td>
                    <span className={`payment-method ${order.paymentMethod ? order.paymentMethod.toLowerCase() : 'unknown'}`}>
                      {order.paymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${order.delivered ? 'yes' : 'no'}`}>
                      {order.delivered ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrder;
