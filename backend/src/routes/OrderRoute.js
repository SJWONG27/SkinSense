const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel'); // Adjust the path according to your project structure

// Get orders for a specific user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  console.log('Received userId:', userId);

  try {
    // Fetch orders for the specified user
    const orders = await Order.find({ userId });
    console.log('Fetched orders:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { userId, items, paymentMethod, deliveryInfo } = req.body;
  console.log(`Received order creation request for user: ${userId}`);

  try {
      if (!Array.isArray(items)) {  // Check for `items`
          return res.status(400).json({ message: 'Items must be an array' });
      }

      // Create an order for each item in the cart
      const orders = items.map(item => ({
          userId,
          itemId: item.itemId,
          name: item.name,
          img: item.img,
          quantity: item.quantity,
          price: item.price,
          deliveryStatus: 'Processing',
          paymentMethod,
          deliveryInfo,
          createdAt: new Date(),
      }));

      // Insert the orders into the Order model
      const createdOrders = await Order.insertMany(orders);
      console.log('Created orders:', createdOrders);

      res.status(201).json({ message: 'Order created successfully', orders: createdOrders });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order' });
  }
});


// Update order status
router.patch('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { deliveryStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { deliveryStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});
// Delete order by ID
router.delete('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Get orders for a specific user to allow review for products ordered
router.get('/:userID/:productID', async (req, res) => {
  const userId  = req.params.userID
  try {
    // Fetch orders for the specified user
    const orders = await Order.find({ userId });
    //console.log('Fetched orders:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
