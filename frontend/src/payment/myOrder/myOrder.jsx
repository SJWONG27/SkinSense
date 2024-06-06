import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrder.css'; 

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
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="my-order-container">Loading...</div>;
  }

  if (error) {
    return <div className="my-order-container">Error: {error}</div>;
  }

  return (
    <div className="my-order-container">
      <h1>My Orders</h1>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order">
              <h2 className="order-id">Order ID: {order._id}</h2>
              {order.items.map(item => (
                <div key={item.productId} className="order-item">
                  <img src={item.img} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="price">Price: {item.price}</p>
                  </div>
                </div>
              ))}
              <div className="order-status">
                <p className={`status ${order.paymentStatus.toLowerCase()}`}>
                  Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrder;

