// src/middleware/CartMiddleware.js
const { CartModel } = require('../models/cartModel');
const { ProductModel } = require('../models/ProductModel');

const cartExists = async (req, res, next) => {
    try {
        const { productName } = req.params;
        const product = await ProductModel.findOne({ name: productName });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const cart = await CartModel.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.itemId.toString() === product._id.toString());
        if (itemIndex > -1) {
            req.product = product; // Pass the product to the next middleware/controller
            next();
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    cartExists,
};