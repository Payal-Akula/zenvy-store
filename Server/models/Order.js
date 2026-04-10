const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String,
    default: "/default-image.jpg"
  },
  source: {
    type: String,
    enum: ['products', 'bestdeals'],
    default: 'products'
  }
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [orderItemSchema],
  amount: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'PLACED', 'SHIPPED', 'DELIVERED', 'Returned', 'Exchange Requested', 'CANCELLED'],
    default: "PENDING"
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'CARD', 'UPI', 'NETBANKING'],
    default: 'COD'
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  timeline: [timelineSchema]
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);