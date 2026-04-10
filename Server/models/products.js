const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: Number,
    comment: String,
    date: Date,
    reviewerName: String,
    reviewerEmail: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: String, // ⚠️ optional (UI use only)

    title: String,
    description: String,
    category: String,

    price: Number,
    discountPercentage: Number,
    discountedTotal: Number,

    rating: Number,
    stock: Number,

    brand: String,
    model: String,
    sku: String,

    tags: [String],
    images: [String],
    thumbnail: String,

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    reviews: [reviewSchema],

    meta: {
      createdAt: Date,
      updatedAt: Date,
      barcode: String,
      qrCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);