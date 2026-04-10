const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const mongoose = require('mongoose');

// ✅ GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ SEARCH PRODUCTS
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.q;
    const products = await Product.find({
      title: { $regex: keyword, $options: "i" },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const paramId = req.params.id;
    let product = null;
    
    if (mongoose.Types.ObjectId.isValid(paramId)) {
      product = await Product.findById(paramId);
    }
    
    if (!product) {
      product = await Product.findOne({ id: paramId });
    }
    
    if (!product) {
      product = await Product.findOne({ 
        title: { $regex: new RegExp(`^${paramId}$`, 'i') } 
      });
    }
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;