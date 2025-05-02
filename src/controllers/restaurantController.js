const restaurantService = require("../services/restaurantService");
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const Review = require("../models/Review");
const axios = require('axios');
/**
 * Create a new restaurant.
 */


const createRestaurant = async (req, res) => {
  try {
    const {
      owner,
      name,
      cuisine,
      address,
      description,
      hours,
      deliveryTime,
      deliveryFee,
      tags,
      coverImage,
      image,
      phone,
      location, 
    } = req.body;

    // Validate required fields
    if (!name || !cuisine || !address || !image || !coverImage) {
      return res.status(400).json({
        success: false,
        message: "Name, cuisine, address, image, and cover image are required",
      });
    }

    // Create restaurant object
    const restaurantData = {
      name,
      owner,
      cuisine,
      address,
      description: description || "",
      hours: hours || "Monday - Sunday: 11:00 AM - 10:00 PM",
      deliveryTime: deliveryTime || 30,
      deliveryFee: deliveryFee || 0,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      image, 
      coverImageUrl: coverImage, 
      phone, 
      location, 
    };

    
    const restaurant = await Restaurant.create(restaurantData);

    res.status(201).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all restaurants (with owner, menu, and reviews).
 * Expects a query parameter: userId.
 */

const getAllRestaurants = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const restaurants = await restaurantService.getAllRestaurantsByOwner(
      ownerId
    );
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

//get all restaurants for customer
const getAllRestaurantsForCustomer = async (req, res) => {
  try {
    const category = req.query.category || null;
    const restaurants = await restaurantService.getAllRestaurantsForCustomer(
      category
    );
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

// controllers/restaurantController.js
const getRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Get Restaurant
    const restaurant = await Restaurant.findById(restaurantId).lean();
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    // Calculate Rating & Reviews
    const reviews = await Review.find({ restaurant: restaurantId });
    const reviewsCount = reviews.length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount || 0;

    // Get Grouped Menu Items
    const menuItems = await Menu.find({ restaurant: restaurantId }).lean();
    const categoriesMap = new Map();
    let categoryId = 1;

    menuItems.forEach((item) => {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: categoryId++,
          name: item.category,
          items: [],
        });
      }
      categoriesMap.get(item.category).items.push({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        popular: item.popular,
        imageUrl: item.image,
        calories: item.calories,
      });
    });

    // Build Response
    const response = {
      id: restaurant._id.toString(),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      rating: avgRating,
      reviews: reviewsCount,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      location: restaurant.location,
      phone: restaurant.phone,
      tags: restaurant.tags,
      imageUrl: restaurant.image.url,
      coverImageUrl: restaurant.coverImageUrl,
      description: restaurant.description,
      hours: restaurant.hours,
      categories: Array.from(categoriesMap.values()),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a restaurant by its ID (with owner, menu, and reviews).
 */
const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { restaurant, menu, reviews } = await restaurantService.getRestaurantById(restaurantId);

    if (!restaurant.isVerified) {
      return res.status(400).json({ message: "Restaurant is not verified yet." });
    }

    res.status(200).json({
      _id: restaurant._id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      description: restaurant.description,
      hours: restaurant.hours,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      tags: restaurant.tags,
      image: restaurant.image,
      coverImageUrl: restaurant.coverImageUrl,
      isVerified: restaurant.isVerified,
      menu,
      reviews,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menu operations
const getMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await Menu.find({ restaurant: restaurantId })
      .sort("category")
      .lean();

    // Group items by category
    const categoriesMap = new Map();
    let categoryCounter = 1;

    menuItems.forEach((item) => {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: categoryCounter++,
          name: item.category,
          items: [],
        });
      }

      categoriesMap.get(item.category).items.push({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        popular: item.popular,
        imageUrl: item.image,
        calories: item.calories,
        available: item.available,
      });
    });

    res.json({
      success: true,
      categories: Array.from(categoriesMap.values()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const {
      name,
      description,
      price,
      category,
      image,
      calories,
      popular,
      available,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required fields",
      });
    }

    // Verify restaurant exists and owner is current user
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or unauthorized",
      });
    }

    // Create new menu item
    const newMenuItem = new Menu({
      restaurant: restaurantId,
      name,
      description: description || "",
      price,
      category,
      image: image || "",
      calories: calories || "0",
      popular: popular || false,
      available: available || true,
    });

    const savedItem = await newMenuItem.save();

    res.status(201).json({
      success: true,
      menuItem: {
        id: savedItem._id,
        ...savedItem.toObject(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const updates = req.body;

    // Find menu item and verify ownership
    const menuItem = await Menu.findById(menuItemId)
      .populate("restaurant")
      .lean();

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      // owner: req.user._id
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this item",
      });
    }

    // Prevent changing restaurant ID
    if (updates.restaurant) {
      delete updates.restaurant;
    }

    const updatedItem = await Menu.findByIdAndUpdate(menuItemId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      menuItem: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    await restaurantService.deleteMenuItem(restaurantId, menuItemId);
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const toggleMenuItemAvailability = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const { available } = req.body;

    // Verify ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      // owner: req.user._id
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this item",
      });
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      menuItemId,
      { available },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      menuItem: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleMenuItemPopularity = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const { popular } = req.body;

    // Verify ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      // owner: req.user._id
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this item",
      });
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      menuItemId,
      { popular },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      menuItem: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    res.status(200).json({ message: "Review added successfully", review });
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
  getRestaurantDetails,
  toggleMenuItemAvailability,
  toggleMenuItemPopularity,
};
