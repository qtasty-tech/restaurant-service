const restaurantService = require('../services/restaurantService');

/**
 * Create a new restaurant.
 */
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    const imageFile = req.file; 
    const restaurant = await restaurantService.createRestaurant(restaurantData, imageFile);
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get all restaurants (with owner, menu, and reviews).
 * Expects a query parameter: userId.
 */

const getAllRestaurants = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const restaurants = await restaurantService.getAllRestaurantsByOwner(ownerId);
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
};

//get all restaurants for customer
const getAllRestaurantsForCustomer = async (req, res) => {
  try {
    const category = req.query.category || null; 
    const restaurants = await restaurantService.getAllRestaurantsForCustomer(category);
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants' });
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

// Menu operations
const getMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menu = await restaurantService.getMenu(restaurantId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItem = req.body;
    const newMenuItem = await restaurantService.createMenuItem(restaurantId, menuItem);
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const updates = req.body;
    const updatedItem = await restaurantService.updateMenuItem(restaurantId, menuItemId, updates);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    await restaurantService.deleteMenuItem(restaurantId, menuItemId);
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const toggleMenuItemAvailability = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const { available } = req.body;
    const updatedItem = await restaurantService.toggleMenuItemAvailability(restaurantId, menuItemId, available);
    res.status(200).json(updatedItem);
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
  addReview,
  getAllRestaurants,
  getMenu,
  createMenu,
  updateMenuItem,
  deleteMenuItem,
  getAllRestaurantsForCustomer,
  toggleMenuItemAvailability
};
