const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel'); // Adjust the path according to your project structure

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
  const { userId, items, total, paymentMethod } = req.body;
  console.log(`Received order creation request for user: ${userId}`);

  try {
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

module.exports = router;
