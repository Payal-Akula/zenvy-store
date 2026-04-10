const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'source'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    source: {
      type: String,
      enum: [
        'Product', 
        'BestDeals', 
        'NewArrival',
        'Fashion',
        'Furniture',
        'HealthBeauty',
        'SmartphoneTablet',
        'Electronics',
        'Jewelry',  // Added Jewelry with capital J
        'products', 
        'bestdeals', 
        'newarrival',
        'fashion',
        'furniture',
        'healthbeauty',
        'smartphonetablet',
        'electronics',
        'jewelry'   // Added jewelry lowercase
      ], 
      default: 'Product'
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);