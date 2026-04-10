const express = require("express");
const router = express.Router();
const Fashion = require("../models/Fashion");
const Furniture = require("../models/Furniture");
const HealthBeauty = require("../models/HealthBeauty");
const SmartphoneTablet = require("../models/SmartphoneTablet");
const Electronics = require("../models/Electronics");

// ✅ GET ALL PRODUCTS FROM ALL CATEGORIES
router.get("/all", async (req, res) => {
  try {
    const [fashion, furniture, healthBeauty, smartphoneTablet, electronics] = await Promise.all([
      Fashion.find().sort({ createdAt: -1 }).lean(),
      Furniture.find().sort({ createdAt: -1 }).lean(),
      HealthBeauty.find().sort({ createdAt: -1 }).lean(),
      SmartphoneTablet.find().sort({ createdAt: -1 }).lean(),
      Electronics.find().sort({ createdAt: -1 }).lean()
    ]);
    
    const allProducts = [...fashion, ...furniture, ...healthBeauty, ...smartphoneTablet, ...electronics];
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET PRODUCTS BY SPECIFIC CATEGORY FROM THEIR RESPECTIVE COLLECTION
router.get("/category/:categoryName", async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    let products = [];
    
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
      default:
        // If no specific category, return all
        const [fashion, furniture, healthBeauty, smartphoneTablet, electronics] = await Promise.all([
          Fashion.find().sort({ createdAt: -1 }).lean(),
          Furniture.find().sort({ createdAt: -1 }).lean(),
          HealthBeauty.find().sort({ createdAt: -1 }).lean(),
          SmartphoneTablet.find().sort({ createdAt: -1 }).lean(),
          Electronics.find().sort({ createdAt: -1 }).lean()
        ]);
        products = [...fashion, ...furniture, ...healthBeauty, ...smartphoneTablet, ...electronics];
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET SINGLE PRODUCT FROM ANY COLLECTION
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Fashion.findById(id);
    if (!product) product = await Furniture.findById(id);
    if (!product) product = await HealthBeauty.findById(id);
    if (!product) product = await SmartphoneTablet.findById(id);
    if (!product) product = await Electronics.findById(id);
    
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET CATEGORY STATISTICS
router.get("/stats", async (req, res) => {
  try {
    const [fashionCount, furnitureCount, healthCount, smartphoneCount, electronicsCount] = await Promise.all([
      Fashion.countDocuments(),
      Furniture.countDocuments(),
      HealthBeauty.countDocuments(),
      SmartphoneTablet.countDocuments(),
      Electronics.countDocuments()
    ]);
    
    const stats = [
      { category: "Fashion", count: fashionCount },
      { category: "Furniture & Decor", count: furnitureCount },
      { category: "Health & Beauty", count: healthCount },
      { category: "Smartphone & Tablet", count: smartphoneCount },
      { category: "Electronics", count: electronicsCount }
    ];
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET FEATURE IMAGES FOR CATEGORIES
router.get("/feature-images", async (req, res) => {
  const featureImages = {
    "Smartphone & Tablet": "https://img.global.news.samsung.com/in/wp-content/uploads/2018/10/1572_S9-Plus-Burgundy-Poster-19x29-01.jpg",
    "Fashion": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    "Furniture & Decor": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop",
    "Health & Beauty": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop",
    "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop"
  };
  res.json(featureImages);
});

module.exports = router;