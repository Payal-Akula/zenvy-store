const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Furniture & Decor" },
  price: Number,
  discountPercentage: Number,
  rating: Number,
  thumbnail: String,
  images: [String],
  brand: String
}, { timestamps: true });

module.exports = mongoose.model("Furniture", furnitureSchema,"furniture");