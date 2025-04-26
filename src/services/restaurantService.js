// restaurant-service/src/services/restaurantService.js
const restaurantRepository = require('../repositories/restaurantRepository');

// Create a new restaurant
const createRestaurant = async (restaurantData) => {
  const restaurant = await restaurantRepository.createRestaurant(restaurantData);
  return restaurant;
};

// Get restaurant by ID, including menu and reviews
const getRestaurantById = async (restaurantId) => {
  const { restaurant, menu, reviews } = await restaurantRepository.getRestaurantById(restaurantId);
  return { restaurant, menu, reviews };
};

// Update the restaurant menu
const updateMenu = async (restaurantId, menu) => {
  const updatedMenu = await restaurantRepository.updateMenu(restaurantId, menu);
  return updatedMenu;
};

// Add a review to a restaurant
const addReview = async (restaurantId, reviewData) => {
  const review = await restaurantRepository.addReview(restaurantId, reviewData);
  return review;
};

// Create menu for a restaurant
const createMenu = async (restaurantId, menuItems) => {
  const newMenu = await restaurantRepository.createMenu(restaurantId, menuItems);
  return newMenu;
};

// Get menu for a restaurant by ID
const getMenu = async (restaurantId) => {
  try {
    // Fetch menu items related to the restaurant
    const menu = await restaurantRepository.getMenu(restaurantId);
    return menu; // Return the menu items
  } catch (error) {
    console.error('Error fetching menu:', error.message);
    throw new Error('Menu not found');
  }
};

// Get all restaurants by owner ID
const getAllRestaurantsByOwner = async (ownerId) => {
  return await restaurantRepository.getRestaurantsByOwner(ownerId);
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateMenu,
  addReview,
  createMenu,
  getMenu, 
  getAllRestaurantsByOwner,
};
