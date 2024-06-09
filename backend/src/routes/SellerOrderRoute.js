const express = require('express');
const router = express.Router();
const Cart = require('../models/CartModel'); // Adjust the path according to your project structure
const SellerOrder = require('../models/SellerOrderModel'); // Adjust the path according to your project structure
router.post('/', async (req, res) => {
    const { userId } = req.body;
    console.log(`Received userId for transfer: ${userId}`);
  
    try {
      // Fetch items from the Cart model for the specified user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        console.log('Cart not found');
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Transform items to match the SellerOrder schema
      const sellerOrders = cart.items.map(item => ({
        userId: cart.userId,
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        deliveryStatus: 'Processing',
        sellerID: item.sellerID,
      }));
  
      console.log('Transformed seller orders:', sellerOrders);
  
      // Insert the transformed data into the SellerOrder model
      await SellerOrder.insertMany(sellerOrders);
  
      // Optionally, clear the cart after transferring the items
      await Cart.updateOne({ userId }, { items: [] });
  
      res.status(200).json({ message: 'Items transferred successfully' });
    } catch (error) {
      console.error('Error transferring items:', error);
      res.status(500).json({ message: 'Error transferring items' });
    }
  });

// Get orders for a specific seller
router.get('/', async (req, res) => {
  const { sellerID } = req.query;
  console.log('Received sellerID:', sellerID);

  try {
    // Fetch orders containing items with the given sellerID
    const orders = await SellerOrder.find({ sellerID });
    console.log('Fetched orders:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.patch('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;
  
    try {
      const order = await SellerOrder.findByIdAndUpdate(orderId, { deliveryStatus }, { new: true });
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
