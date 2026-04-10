const mongoose = require("mongoose");

const electronicsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Electronics" },
  price: Number,
  discountPercentage: Number,
  rating: Number,
  thumbnail: String,
  images: [String],
  brand: String
}, { timestamps: true });

module.exports = mongoose.model("Electronics", electronicsSchema,"electronic");