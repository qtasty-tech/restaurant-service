// restaurant-service/src/routes/restaurantRoutes.js
const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../config/multer');

router.get('/:id', authMiddleware, restaurantController.getAllRestaurants);
router.post('/', authMiddleware, upload.single('image'), restaurantController.createRestaurant);
router.get('/:restaurantId', authMiddleware, restaurantController.getRestaurantById);
router.post('/:restaurantId/review', authMiddleware, restaurantController.addReview);

//get all restaurent for customer
router.get('/', authMiddleware, restaurantController.getAllRestaurantsForCustomer); 

// Menu operations
router.get('/:restaurantId/menu', authMiddleware, restaurantController.getMenu);
router.post('/:restaurantId/menu', authMiddleware, restaurantController.createMenu);
router.put('/:restaurantId/menu/:menuItemId', authMiddleware, restaurantController.updateMenuItem);
router.delete('/:restaurantId/menu/:menuItemId', authMiddleware, restaurantController.deleteMenuItem);
router.patch('/:restaurantId/menu/:menuItemId/availability', authMiddleware, restaurantController.toggleMenuItemAvailability);



module.exports = router;
