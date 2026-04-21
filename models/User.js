const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    totalOrders: { type: Number, default: 0 },
    prepaidOrders: { type: Number, default: 0 },
    codOrders: { type: Number, default: 0 },
    returns: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },
    creditScore: { type: Number, default: 500 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
