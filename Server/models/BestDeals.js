const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    reviewerName: String,
    reviewerEmail: String,
  },
  { timestamps: true, _id: false }
);

const bestDealsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    category: {
      type: String,
      index: true,
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

    discountedPrice: Number,

    stock: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    images: [String],

    rating: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    dealStart: {
      type: Date,
      default: Date.now,
    },

    dealEnd: {
      type: Date,
      required: true,
      index: true,
    },

    tags: [String],
  },
  { timestamps: true }
);


module.exports = mongoose.model("BestDeals", bestDealsSchema, "bestDeal");