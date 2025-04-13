const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL to an image (optional)
  available: { type: Boolean, default: true }, // Availability status
  createdAt: { type: Date, default: Date.now },
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
