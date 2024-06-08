const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const Order = require('../models/orderModel');

router.use(express.json());

router.post('/', orderController.createOrder);

router.get('/', async (req, res) => {
    const { sellerID } = req.query;
    console.log('Received sellerID:', sellerID); 
  
    try {
      const orders = await Order.find({ 'items.sellerID': sellerID });
      console.log('Fetched orders:', orders); // Log fetched orders
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  
  router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus } = req.body;
  
        const order = await Order.findByIdAndUpdate(id, { 'items.$[].deliveryStatus': deliveryStatus }, { new: true });
  
        if (!order) {
          return res.status(404).send('Order not found');
        }
  
        res.json(order);
      } catch (error) {
        res.status(500).send('Error updating order status');
      }
  });

  

module.exports = router;  