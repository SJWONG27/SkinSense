const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      itemId: { type: String, required: true }, 
      name: String,
      img: String,
      quantity: Number,
      price: Number,
      deliveryStatus: {
        type: String,
        default: 'Processing',
      },
      sellerID: { type: String, required: true },
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

// Check if the Order model already exists before defining it
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
