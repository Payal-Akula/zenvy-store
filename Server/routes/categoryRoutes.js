const express = require("express");
const router = express.Router();
const NewArrival = require("../models/NewArrival");

// ✅ GET PRODUCTS BY CATEGORY
router.get("/category/:categoryName", async (req, res) => {
  try {
    const categoryName = decodeURIComponent(req.params.categoryName);
    const products = await NewArrival.find({ 
      category: { $regex: new RegExp(categoryName, 'i') } 
    }).sort({ createdAt: -1 });
    
    res.json(products);
  } catch (err) {
    console.error("Error fetching by category:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL FASHION PRODUCTS
router.get("/fashion", async (req, res) => {
  try {
    const products = await NewArrival.find({ 
      category: { $regex: /Fashion/i } 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL FURNITURE & DECOR PRODUCTS
router.get("/furniture", async (req, res) => {
  try {
    const products = await NewArrival.find({ 
      category: { $regex: /Furniture/i } 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL HEALTH & BEAUTY PRODUCTS
router.get("/health-beauty", async (req, res) => {
  try {
    const products = await NewArrival.find({ 
      category: { $regex: /Health/i } 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL SMARTPHONE & TABLET PRODUCTS
router.get("/smartphone-tablet", async (req, res) => {
  try {
    const products = await NewArrival.find({ 
      $or: [
        { category: { $regex: /Smartphone/i } },
        { category: { $regex: /Tablet/i } },
        { category: { $regex: /Smart Phone/i } }
      ]
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL ELECTRONICS PRODUCTS
router.get("/electronics", async (req, res) => {
  try {
    const products = await NewArrival.find({ 
      category: { $regex: /Electronics/i } 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET FEATURE IMAGES FOR CATEGORIES (Admin endpoint to update)
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