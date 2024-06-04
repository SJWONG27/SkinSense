const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            img: String,
            quantity: Number,
        }
    ],
    deliveryInfo: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
    },
    paymentMethod: String,
    paymentStatus: {
        type: String,
        default: 'Pending',
    },
    paymentId: String,
    amount: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);