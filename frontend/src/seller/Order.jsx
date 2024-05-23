import React , { useState }from 'react'
function Order() {

  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', status: 'Processing' },
    { id: 2, customer: 'Jane Smith', status: 'Shipped' },
    { id: 3, customer: 'Michael Johnson', status: 'Delivered' },
  ]);

  // Function to update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
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
              <th>Customer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => updateOrderStatus(order.id, 'Processing')}>
                    Mark as Processing
                  </button>
                  <button onClick={() => updateOrderStatus(order.id, 'Shipped')}>
                    Mark as Shipped
                  </button>
                  <button onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                    Mark as Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    
      
  )
}

export default Order