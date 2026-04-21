// server.js - Main Express Server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: '*', // Allow all origins (update to your domain in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const creditRoutes = require('./routes/credit');

app.use('/api', authRoutes);           // /api/register, /api/login
app.use('/api', transactionRoutes);    // /api/add-transaction, /api/transactions
app.use('/api', creditRoutes);         // /api/dashboard, /api/credit-score

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Credit Profile API is running!' });
});

// ─── MongoDB Connection ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use.`);
        console.error('ℹ️ Another server instance is already running. Stop it with Ctrl+C or use a different PORT in .env.');
        process.exit(1);
      }

      console.error('❌ Server startup error:', err.message);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
