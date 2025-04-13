// restaurant-service/src/controllers/restaurantController.js
const restaurantService = require('../services/restaurantService');

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get restaurant by ID, including menu and reviews
const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { restaurant, menu, reviews } = await restaurantService.getRestaurantById(restaurantId);
    res.status(200).json({ restaurant, menu, reviews });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update the restaurant menu
const updateMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { menu } = req.body;
    const updatedMenu = await restaurantService.updateMenu(restaurantId, menu);
    res.status(200).json({ message: 'Menu updated successfully', updatedMenu });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a review to a restaurant
const addReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { userId, rating, comment } = req.body;
    const reviewData = { user: userId, rating, comment };
    const review = await restaurantService.addReview(restaurantId, reviewData);
    res.status(200).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateMenu,
  addReview,
};
