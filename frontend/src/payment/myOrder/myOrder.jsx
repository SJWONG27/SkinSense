import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myOrder.css';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          withCredentials: true, // This sends cookies with the request
        });
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError('Unexpected response format.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="my-order-container">
      <h1>My Orders</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Created At</th>
            <th>Price</th>
            <th>Delivery Status</th>
            <th>Payment Method</th>
            <th>Paid Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8">No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img src={order.items[0].img} alt={order.items[0].name} />
                </td>
                <td>{order.items[0].name}</td>
                <td>{order.items[0].quantity}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>${order.items[0].price}</td>
                <td>{order.isDelivered ? 'Delivered' : 'Pending'}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.isPaid ? 'Paid' : 'Pending'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrder;
