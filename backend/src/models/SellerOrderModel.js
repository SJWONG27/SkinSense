const mongoose = require('mongoose');

const sellerOrderSchema = new mongoose.Schema({
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
    sellerID: { type: String, required: true },
});


const SellerOrder = mongoose.models.SellerOrder || mongoose.model('SellerOrder', sellerOrderSchema);

module.exports = SellerOrder;
