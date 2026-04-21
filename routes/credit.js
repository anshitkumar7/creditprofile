const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function getRiskLevel(score) {
  if (score >= 750) return 'Low Risk';
  if (score >= 600) return 'Medium Risk';
  return 'High Risk';
}

function getSuggestions(user) {
  const suggestions = [];

  if (user.codOrders > user.prepaidOrders) {
    suggestions.push('Switch to UPI or Card payments to boost your credit score.');
  }
  if (user.returns > 3) {
    suggestions.push('High return rate detected. Reducing returns will improve your score.');
  }
  if (user.totalOrders < 5) {
    suggestions.push('Place more orders to build a stronger credit history.');
  }
  if (user.creditScore < 600) {
    suggestions.push('Your score is in the High Risk zone. Focus on prepaid payments and avoiding returns.');
  }
  if (user.creditScore >= 750) {
    suggestions.push('Excellent profile! You qualify for premium benefits and higher credit limits.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Keep maintaining your good payment habits to stay in the Medium/Low risk zone.');
  }

  return suggestions;
}

router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      name: user.name,
      email: user.email,
      totalOrders: user.totalOrders,
      totalSpending: user.totalSpending,
      prepaidOrders: user.prepaidOrders,
      codOrders: user.codOrders,
      returns: user.returns,
      creditScore: user.creditScore,
      riskLevel: getRiskLevel(user.creditScore),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/credit-score', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      creditScore: user.creditScore,
      riskLevel: getRiskLevel(user.creditScore),
      suggestions: getSuggestions(user),
      breakdown: {
        baseScore: 500,
        fromOrders: user.totalOrders * 2,
        fromPrepaid: user.prepaidOrders * 5,
        fromCOD: -(user.codOrders * 5),
        fromReturns: -(user.returns * 10),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
