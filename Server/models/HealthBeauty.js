const mongoose = require("mongoose");

const healthBeautySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Health & Beauty" },
  price: Number,
  discountPercentage: Number,
  rating: Number,
  thumbnail: String,
  images: [String],
  brand: String
}, { timestamps: true });

module.exports = mongoose.model("HealthBeauty", healthBeautySchema,"beauty");