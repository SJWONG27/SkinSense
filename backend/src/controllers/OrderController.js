const Order = require('../models/orderModel');
const Product = require('../models/ProductModel');

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

    // Fetch product details to get sellerID for each item
    const itemsWithSellerID = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.itemId);
      if (!product) {
        throw new Error(`Product with ID ${item.itemId} not found`);
      }
      return {
        itemId: item.itemId,
        name: item.name,
        img: item.img,
        quantity: item.quantity,
        price: item.price,
        sellerID: product.sellerID 
      };
    }));

    const order = new Order({
      userId, // Include userId in order
      items: itemsWithSellerID, // Use items with sellerID
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
