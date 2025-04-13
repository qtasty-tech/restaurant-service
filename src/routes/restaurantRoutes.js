// restaurant-service/src/routes/restaurantRoutes.js
const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a restaurant (protected route)
router.post('/', authMiddleware, restaurantController.createRestaurant);

// Get restaurant by ID (protected route)
router.get('/:restaurantId', authMiddleware, restaurantController.getRestaurantById);

// Update restaurant menu (protected route)
router.put('/:restaurantId/menu', authMiddleware, restaurantController.updateMenu);

// Add review to restaurant (protected route)
router.post('/:restaurantId/review', authMiddleware, restaurantController.addReview);

module.exports = router;
