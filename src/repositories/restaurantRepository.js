// restaurant-service/src/repositories/restaurantRepository.js
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const Review = require('../models/Review');

// Create a new restaurant
const createRestaurant = async (restaurantData) => {
  const restaurant = new Restaurant(restaurantData);
  await restaurant.save();
  return restaurant;
};

// Get restaurant by ID, including menu and reviews
const getRestaurantById = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId).populate('owner');
  const menu = await Menu.find({ restaurant: restaurantId });
  const reviews = await Review.find({ restaurant: restaurantId });
  return { restaurant, menu, reviews };
};

// Update restaurant menu
const updateMenu = async (restaurantId, menuItems) => {
  await Menu.deleteMany({ restaurant: restaurantId }); // Optionally delete the old menu
  const menu = await Menu.insertMany(menuItems.map(item => ({ ...item, restaurant: restaurantId })));
  return menu;
};

// Add a review for a restaurant
const addReview = async (restaurantId, reviewData) => {
  const review = new Review({ restaurant: restaurantId, ...reviewData });
  await review.save();
  return review;
};

const createMenu = async (restaurantId, menuItems) => {
  const menu = await Menu.insertMany(menuItems.map(item => ({ ...item, restaurant: restaurantId })));
  return menu;
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateMenu,
  addReview,
  createMenu
};
