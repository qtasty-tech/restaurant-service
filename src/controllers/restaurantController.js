const restaurantService = require('../services/restaurantService');

/**
 * Create a new restaurant.
 */
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get a restaurant by its ID (with owner, menu, and reviews).
 */
const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.getRestaurantById(restaurantId);

    if (!restaurant.isVerified) {
      return res.status(400).json({ message: 'Restaurant is not verified yet.' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get menu availability for a restaurant.
 * Expects a query parameter: restaurantId.
 */
const getMenuAvailability = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) {
      console.log('Error: restaurantId query parameter is missing');
      return res.status(400).json({ message: 'restaurantId query parameter is required' });
    }

    console.log('Received restaurantId:', restaurantId); // Log the restaurantId
    
    const menu = await restaurantService.getMenu(restaurantId);
    res.status(200).json({ menu });
  } catch (error) {
    console.error('Error checking menu availability:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const createMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { menuItems } = req.body;  // Expecting menuItems to be an array of objects
    const newMenu = await restaurantService.createMenu(restaurantId, menuItems);
    res.status(201).json({ message: 'Menu created successfully', newMenu });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update the restaurant's menu.
 */
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

/**
 * Add a review to the restaurant.
 */
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
  getMenuAvailability,
  updateMenu,
  addReview,
  createMenu 
};
