const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function calculateCreditScore(user) {
  let score = 500;
  score += Math.min(user.totalOrders * 2, 100);
  score += user.prepaidOrders * 5;
  score -= user.codOrders * 5;
  score -= user.returns * 10;

  if (score < 300) score = 300;
  if (score > 900) score = 900;
  return score;
}

router.post('/add-transaction', protect, async (req, res) => {
  try {
    const { amount, paymentMethod, returned } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!['COD', 'UPI', 'Card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'paymentMethod must be COD, UPI, or Card' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transaction = await Transaction.create({
      userId: user._id,
      amount: Number(amount),
      paymentMethod,
      returned: Boolean(returned),
    });

    user.totalOrders += 1;
    user.totalSpending += Number(amount);

    if (paymentMethod === 'COD') user.codOrders += 1;
    else user.prepaidOrders += 1;

    if (Boolean(returned)) user.returns += 1;

    user.creditScore = calculateCreditScore(user);
    await user.save();

    return res.status(201).json({
      message: 'Transaction added successfully',
      transaction,
      creditScore: user.creditScore,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json({ transactions });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
