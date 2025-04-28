// restaurant-service/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
require('./config/cloudinary')();
const restaurantRoutes = require('./routes/restaurantRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 

app.use(cors())
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
