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

const createMenu = async (restaurantId, menuItems) => {

  const newMenu = await restaurantRepository.createMenu(restaurantId, menuItems);
  return newMenu;
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateMenu,
  addReview,
  createMenu
};
