const express = require("express");
const router = express.Router();
const Fashion = require("../models/Fashion");
const Furniture = require("../models/Furniture");
const HealthBeauty = require("../models/HealthBeauty");
const SmartphoneTablet = require("../models/SmartphoneTablet");
const Electronics = require("../models/Electronics");
const Jewelry = require("../models/Jewelry");

// ========== GET ALL PRODUCTS FROM ALL COLLECTIONS ==========
router.get("/all", async (req, res) => {
  try {
    const [fashion, furniture, healthBeauty, smartphoneTablet, electronics, jewelry] = await Promise.all([
      Fashion.find().sort({ createdAt: -1 }).lean(),
      Furniture.find().sort({ createdAt: -1 }).lean(),
      HealthBeauty.find().sort({ createdAt: -1 }).lean(),
      SmartphoneTablet.find().sort({ createdAt: -1 }).lean(),
      Electronics.find().sort({ createdAt: -1 }).lean(),
      Jewelry.find().sort({ createdAt: -1 }).lean()
    ]);
    
    const allProducts = [...fashion, ...furniture, ...healthBeauty, ...smartphoneTablet, ...electronics, ...jewelry];
    res.json(allProducts);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET PRODUCTS BY CATEGORY NAME ==========
router.get("/category/:categoryName", async (req, res) => {
  try {
    const categoryName = decodeURIComponent(req.params.categoryName);
    let products = [];
    
    // console.log(`Fetching products for category: ${categoryName}`);
    
    switch(categoryName.toLowerCase()) {
      case "fashion":
        products = await Fashion.find().sort({ createdAt: -1 });
        break;
      case "furniture & decor":
        products = await Furniture.find().sort({ createdAt: -1 });
        break;
      case "health & beauty":
        products = await HealthBeauty.find().sort({ createdAt: -1 });
        break;
      case "smartphone & tablet":
        products = await SmartphoneTablet.find().sort({ createdAt: -1 });
        break;
      case "electronics":
        products = await Electronics.find().sort({ createdAt: -1 });
        break;
      case "jewelry":
        products = await Jewelry.find().sort({ createdAt: -1 });
        break;
      default:
        products = [];
    }
    
    // console.log(`Found ${products.length} products for ${categoryName}`);
    res.json(products);
  } catch (err) {
    console.error("Error fetching by category:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET FASHION PRODUCTS ==========
router.get("/fashion", async (req, res) => {
  try {
    const products = await Fashion.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching fashion products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET FURNITURE PRODUCTS ==========
router.get("/furniture", async (req, res) => {
  try {
    const products = await Furniture.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching furniture products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET HEALTH & BEAUTY PRODUCTS ==========
router.get("/health-beauty", async (req, res) => {
  try {
    const products = await HealthBeauty.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching health & beauty products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET SMARTPHONE & TABLET PRODUCTS ==========
router.get("/smartphone-tablet", async (req, res) => {
  try {
    const products = await SmartphoneTablet.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching smartphone & tablet products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET ELECTRONICS PRODUCTS ==========
router.get("/electronics", async (req, res) => {
  try {
    const products = await Electronics.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching electronics products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET JEWELRY PRODUCTS ==========
router.get("/jewelry", async (req, res) => {
  try {
    const products = await Jewelry.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching jewelry products:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET SINGLE PRODUCT FROM ANY COLLECTION ==========
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    let product = await Fashion.findById(id);
    if (!product) product = await Furniture.findById(id);
    if (!product) product = await HealthBeauty.findById(id);
    if (!product) product = await SmartphoneTablet.findById(id);
    if (!product) product = await Electronics.findById(id);
    if (!product) product = await Jewelry.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET PRODUCTS BY COLLECTION TYPE ==========
router.get("/collection/:type", async (req, res) => {
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
        products = await Jewelry.find().sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({ message: "Invalid collection type" });
    }
    
    res.json(products);
  } catch (err) {
    console.error("Error fetching by collection:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;