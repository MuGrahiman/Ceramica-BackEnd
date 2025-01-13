// models/Cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: { type: Number}
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
}); // Automatically manages createdAt and updatedAt


module.exports = mongoose.model('Cart', CartSchema);
