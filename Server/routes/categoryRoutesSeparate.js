const express = require("express");
const router = express.Router();
const Fashion = require("../models/Fashion");
const Furniture = require("../models/Furniture");
const HealthBeauty = require("../models/HealthBeauty");
const SmartphoneTablet = require("../models/SmartphoneTablet");
const Electronics = require("../models/Electronics");
const Jewelry = require("../models/Jewelry");

// Get products by category type
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    let products = [];
    
    switch(type) {
      case "fashion":
        products = await Fashion.find().sort({ createdAt: -1 });
        break;
      case "furniture":
        products = await Furniture.find().sort({ createdAt: -1 });
        break;
      case "health-beauty":
        products = await HealthBeauty.find().sort({ createdAt: -1 });
        break;
      case "smartphone-tablet":
        products = await SmartphoneTablet.find().sort({ createdAt: -1 });
        break;
      case "electronics":
        products = await Electronics.find().sort({ createdAt: -1 });
        break;
        case "jewelry":
        products = await Jewerly.find().sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({ message: "Invalid category" });
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product from any category
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Fashion.findById(id);
    if (!product) product = await Furniture.findById(id);
    if (!product) product = await HealthBeauty.findById(id);
    if (!product) product = await SmartphoneTablet.findById(id);
    if (!product) product = await Electronics.findById(id);
    if (!product) product = await Jewelry.findById(id);

    
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;