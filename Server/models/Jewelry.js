const mongoose = require("mongoose");

const jewelrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Jewelry" },
  price: Number,
  discountPercentage: Number,
  rating: Number,
  thumbnail: String,
  images: [String],
  brand: String
}, { timestamps: true });

module.exports = mongoose.model("Jewelry", jewelrySchema, "jewelry");