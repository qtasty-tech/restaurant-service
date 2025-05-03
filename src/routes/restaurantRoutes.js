// restaurant-service/src/routes/restaurantRoutes.js
const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

//restaurent owner
router.get('/:id', authMiddleware, restaurantController.getAllRestaurants);
router.post("/",authMiddleware,upload.fields([{ name: "image", maxCount: 1 },{ name: "coverImage", maxCount: 1 },]),restaurantController.createRestaurant);
router.get('/:restaurantId',authMiddleware,restaurantController.getRestaurantById);//For owner
router.post('/:restaurantId/review', authMiddleware, restaurantController.addReview);

// Menu operations
router.get('/:restaurantId/menu', restaurantController.getMenu);
router.post("/:restaurantId/menu",upload.single("image"),restaurantController.createMenu);
router.put("/:restaurantId/menu/:menuItemId",authMiddleware,upload.single("image"),restaurantController.updateMenuItem);
router.delete('/:restaurantId/menu/:menuItemId', authMiddleware, restaurantController.deleteMenuItem);
router.patch('/:restaurantId/menu/:menuItemId/availability', authMiddleware, restaurantController.toggleMenuItemAvailability);
router.patch('/:restaurantId/menu/:menuItemId/popularity', authMiddleware, restaurantController.toggleMenuItemPopularity);

//get all restaurent for customer
router.get('/', restaurantController.getAllRestaurantsForCustomer);
router.get('/by-id/:restaurantId', restaurantController.getRestaurantDetails);


module.exports = router;
