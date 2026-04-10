const mongoose = require("mongoose");

const newArrivalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['Fashion', 'Furniture & Decor', 'Health & Beauty', 'Smartphone & Tablet', 'Smart Phone', 'Electronics', 'Home & Kitchen'],
      default: 'Electronics'
    },
    brand: String,
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountedTotal: Number,
    originalPrice: Number,
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [String],
    tags: [String],
    model: String,
    quantity: Number,
    total: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewArrival", newArrivalSchema, "smartPhone");