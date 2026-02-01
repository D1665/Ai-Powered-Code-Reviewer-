// server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// 🌐 Enable CORS
app.use(cors());

// 📦 Parse JSON
app.use(express.json());

// 🏠 Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ⏱ Rate limiter for AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,               // only 1 request per minute
  message: "⏳ Please wait 60 seconds before next review."
});

// Apply rate limiter ONLY to /ai routes
app.use('/ai', aiLimiter);

// 🛠 AI routes
app.use('/ai', aiRoutes);

// ✅ Export app
module.exports = app;
