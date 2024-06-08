const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      deliveryInfo,
      paymentMethod,
      paymentId,
      amount
    } = req.body;

    const order = new Order({
      userId, // Include userId in order
      items: items.map(item => ({
        itemId: item.itemId, // Use itemId
        name: item.name,
        img: item.img,
        quantity: item.quantity,
        price: item.price // Include price if needed
      })),
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

module.exports = {
  createOrder
};
