// restaurant-service/src/repositories/restaurantRepository.js
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const Review = require("../models/Review");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

const createRestaurant = async (restaurantData, imageFile) => {
  if (!imageFile) {
    throw new Error("Thumbnail not attached");
  }

  try {
    const restaurant = new Restaurant(restaurantData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'restaurants'
    });
    restaurant.image = {
      url: imageUpload.secure_url,
      publicId: imageUpload.public_id
    };
    await restaurant.save();
    fs.unlinkSync(imageFile.path);
    
    return restaurant;
  } catch (error) {
    if (imageFile?.path && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
    throw error;
  }
};
//get all restaurants for customer
const getAllRestaurantsForCustomer = async (category = null) => {
  const query = { isVerified: true };

  if (category && category !== 'all') {
    query.category = { $in: [category] };
  }

  const restaurants = await Restaurant.find(query);
  return restaurants;
};

// Get restaurant by ID, including menu and reviews
const getRestaurantById = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId).populate("owner");
  const menu = await Menu.find({ restaurant: restaurantId });
  const reviews = await Review.find({ restaurant: restaurantId });
  return { restaurant, menu, reviews };
};

// Update restaurant menu
const updateMenu = async (restaurantId, menuItems) => {
  await Menu.deleteMany({ restaurant: restaurantId }); // Optionally delete the old menu
  const menu = await Menu.insertMany(
    menuItems.map((item) => ({ ...item, restaurant: restaurantId }))
  );
  return menu;
};

// Add a review for a restaurant
const addReview = async (restaurantId, reviewData) => {
  const review = new Review({ restaurant: restaurantId, ...reviewData });
  await review.save();
  return review;
};

// Menu operations
const createMenuItem = async (restaurantId, menuItem) => {
  const newItem = new Menu({ ...menuItem, restaurant: restaurantId });
  await newItem.save();
  return newItem;
};

const updateMenuItem = async (menuItemId, updates) => {
  const updatedItem = await Menu.findByIdAndUpdate(menuItemId, updates, {
    new: true,
  });
  return updatedItem;
};

const deleteMenuItem = async (menuItemId) => {
  await Menu.findByIdAndDelete(menuItemId);
};

// Get menu for a restaurant by ID
const getMenu = async (restaurantId) => {
  const menu = await Menu.find({ restaurant: restaurantId });
  return menu;
};

// Get all restaurants by owner ID
const getRestaurantsByOwner = async (ownerId) => {
  return await Restaurant.find({ owner: ownerId });
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateMenu,
  addReview,
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllRestaurantsForCustomer,
  getRestaurantsByOwner,
};
