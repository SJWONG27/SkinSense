import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../general/UserContext';
import axios from 'axios';
import './myOrder.css'; // Import the CSS file
import { FaTrashAlt } from 'react-icons/fa';

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext); // Get the logged-in user's info

  useEffect(() => {
    const fetchOrdersAndStatus = async () => {
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      try {
        // Fetch orders and all seller orders in parallel
        const [ordersResponse, sellerOrdersResponse] = await Promise.all([
          axios.get(`http://localhost:4000/orders?userId=${userId}`),
          axios.get(`http://localhost:4000/sellerorders/user?userId=${userId}`)
        ]);

        const orders = ordersResponse.data;
        const sellerOrders = sellerOrdersResponse.data;

        // Merge the delivery status from seller orders into the orders
        const ordersWithStatus = orders.map(order => {
          // Find matching seller order based on itemId and sellerID
          const matchingSellerOrder = sellerOrders.find(sellerOrder => sellerOrder.itemId === order.itemId && sellerOrder.userId === userId);
          return {
            ...order,
            deliveryStatus: matchingSellerOrder ? matchingSellerOrder.deliveryStatus : order.deliveryStatus
          };
        });

        console.log('Fetched orders with merged status:', ordersWithStatus);
        setOrders(ordersWithStatus);
      } catch (error) {
        console.error('Error fetching orders or status:', error);
      }
    };

    fetchOrdersAndStatus();
  }, [user]);

  const handleRemoveOrder = async (orderId) => {
    const userConfirmed = window.confirm("Are you sure you want to remove this order?");
    if (!userConfirmed) return;

    try {
      await axios.delete(`http://localhost:4000/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  return (
    <div className='MyOrder'>
      <header className='header'>
        <h1>Orders</h1>
      </header>
      <div className='ordertable'>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Created At</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Delivery Status</th>
              <th>Payment Method</th>
              <th>Address</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.name}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>RM{order.price ? order.price.toFixed(2) : '0.00'}</td>
                  <td>{order.quantity || '0'}</td>
                  <td>RM{(order.price * order.quantity).toFixed(2)}</td>
                  <td>
                    <span className={`status ${order.deliveryStatus ? order.deliveryStatus.toLowerCase() : 'processing'}`}>
                      {order.deliveryStatus || 'Processing'}
                    </span>
                  </td>
                  <td>{order.paymentMethod || 'N/A'}</td>
                  <td>
                    {order.deliveryInfo
                      ? `${order.deliveryInfo.street}, ${order.deliveryInfo.city}, ${order.deliveryInfo.state}, ${order.deliveryInfo.zipCode}, ${order.deliveryInfo.country}`
                      : 'N/A'}
                  </td>
                  <td>
                    <button className='remove-btn' onClick={() => handleRemoveOrder(order._id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrder;
