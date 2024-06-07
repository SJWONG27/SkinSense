const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryInfo,
      paymentMethod,
      paymentId,
      amount
    } = req.body;

    const order = new Order({
      items,
      deliveryInfo,
      paymentMethod,
      paymentId,
      amount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add more controller functions like getOrder, updateOrder, etc. based on your requirements

module.exports = {
  createOrder
};
