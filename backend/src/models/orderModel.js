const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    img: String,
    quantity: Number,
    price: Number,
    deliveryStatus: {
        type: String,
        default: 'Processing',
    },
    deliveryInfo: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },
    paymentMethod: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
