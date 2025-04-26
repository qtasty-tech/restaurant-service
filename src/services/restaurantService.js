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

// Add a review to a restaurant
const addReview = async (restaurantId, reviewData) => {
  const review = await restaurantRepository.addReview(restaurantId, reviewData);
  return review;
};

// Menu operations
const getMenu = async (restaurantId) => {
  try {
    const menu = await restaurantRepository.getMenu(restaurantId);
    return menu; 
  } catch (error) {
    console.error('Error fetching menu:', error.message);
    throw new Error('Menu not found');
  }
};

const createMenuItem = async (restaurantId, menuItem) => {
  const newItem = await restaurantRepository.createMenuItem(restaurantId, menuItem);
  return newItem;
};

const updateMenuItem = async (restaurantId, menuItemId, updates) => {
  const updatedItem = await restaurantRepository.updateMenuItem(menuItemId, updates);
  return updatedItem;
};

const deleteMenuItem = async (restaurantId, menuItemId) => {
  await restaurantRepository.deleteMenuItem(menuItemId);
};

const toggleMenuItemAvailability = async (restaurantId, menuItemId, available) => {
  const updatedItem = await restaurantRepository.updateMenuItem(menuItemId, { available });
  return updatedItem;
};


// Get all restaurants by owner ID
const getAllRestaurantsByOwner = async (ownerId) => {
  return await restaurantRepository.getRestaurantsByOwner(ownerId);
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  addReview,
  getMenu, 
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getAllRestaurantsByOwner,
};
