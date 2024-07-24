import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../general/UserContext';
import axios from 'axios';

function Order() {
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
        const response = await axios.get(`http://localhost:4000/sellerorders?sellerID=${userId}`);
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:4000/sellerorders/${orderId}`, {
        deliveryStatus: newStatus,
      });

      const updatedOrder = response.data;
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return { ...order, deliveryStatus: newStatus };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className='Order'>
      <div className='pagetitle'>
        <h2>Manage Orders</h2>
      </div>
      <div className='ordertable'>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId}</td>
                  <td>{order.name}</td>
                  <td>{order.deliveryStatus}</td>
                  <td>
                    <button onClick={() => updateOrderStatus(order._id, 'Processing')}>
                      Mark as Processing
                    </button>
                    <button onClick={() => updateOrderStatus(order._id, 'Shipped')}>
                      Mark as Shipped
                    </button>
                    <button onClick={() => updateOrderStatus(order._id, 'Delivered')}>
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
