const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, required: true }, 
  coverImageUrl: { type: String, required: true },
  deliveryTime: Number,
  deliveryFee: Number,
  tags: [String],
  description: String,
  hours: String,
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ["Point"], 
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  phone: { type: String }, 
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
