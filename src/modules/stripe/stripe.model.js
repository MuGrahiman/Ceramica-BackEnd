const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true }, // Stripe PaymentIntent ID
  amount: { type: Number, required: true }, // Amount in cents
  currency: { type: String, required: true }, // Currency code (e.g., 'usd')
  status: { type: String, required: true }, // Payment status (e.g., 'succeeded', 'failed')
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);