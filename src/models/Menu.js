const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true }, 
  available: { type: Boolean, default: true }, 
  popular: { type: Boolean, default: false }, // New field
  calories: String ,
  createdAt: { type: Date, default: Date.now },
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
