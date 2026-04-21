// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  // Order statistics
  totalOrders: { type: Number, default: 0 },
  prepaidOrders: { type: Number, default: 0 },   // UPI + Card
  codOrders: { type: Number, default: 0 },        // Cash on Delivery
  returns: { type: Number, default: 0 },
  totalSpending: { type: Number, default: 0 },
  // Credit score (calculated)
  creditScore: { type: Number, default: 500 }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
