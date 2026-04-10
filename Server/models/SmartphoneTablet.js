const mongoose = require("mongoose");

const smartphoneTabletSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Smartphone & Tablet" },
  price: Number,
  discountPercentage: Number,
  rating: Number,
  thumbnail: String,
  images: [String],
  brand: String,
  model: String,
  storage: String,
  ram: String
}, { timestamps: true });

module.exports = mongoose.model("SmartphoneTablet", smartphoneTabletSchema,"smartPhone");