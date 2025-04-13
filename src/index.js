// restaurant-service/src/index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const restaurantRoutes = require('./routes/restaurantRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Use restaurant routes
app.use('/api/restaurants', restaurantRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Restaurant Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
