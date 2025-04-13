const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/menu', authMiddleware, restaurantController.getMenuAvailability);

router.post('/', authMiddleware, restaurantController.createRestaurant);
router.get('/:restaurantId', authMiddleware, restaurantController.getRestaurantById);
router.put('/:restaurantId/menu', authMiddleware, restaurantController.updateMenu);
router.post('/:restaurantId/review', authMiddleware, restaurantController.addReview);

module.exports = router;
