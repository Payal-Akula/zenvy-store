const express = require("express");
const router = express.Router();
const NewArrival = require("../models/NewArrival");
const mongoose = require("mongoose");

// ✅ GET ALL NEW ARRIVALS (Latest products)
router.get("/", async (req, res) => {
  try {
    // Get latest 20 products sorted by createdAt or _id
    const arrivals = await NewArrival.find()
      .sort({ createdAt: -1, _id: -1 })
      .limit(20);
    res.json(arrivals);
  } catch (err) {
    console.error("Error fetching new arrivals:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET NEW ARRIVALS BY CATEGORY
router.get("/category/:category", async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);
    const arrivals = await NewArrival.find({ 
      category: { $regex: new RegExp(category, 'i') } 
    }).sort({ createdAt: -1, _id: -1 });
    res.json(arrivals);
  } catch (err) {
    console.error("Error fetching by category:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET SINGLE NEW ARRIVAL
router.get("/:id", async (req, res) => {
  try {
    const paramId = req.params.id;
    let arrival = null;

    if (mongoose.Types.ObjectId.isValid(paramId)) {
      arrival = await NewArrival.findById(paramId);
    }

    if (!arrival) {
      arrival = await NewArrival.findOne({ 
        title: { $regex: new RegExp(`^${paramId}$`, "i") } 
      });
    }

    if (!arrival) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(arrival);
  } catch (err) {
    console.error("Error fetching single product:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ SEARCH NEW ARRIVALS
router.get("/search/:keyword", async (req, res) => {
  try {
    const arrivals = await NewArrival.find({
      title: { $regex: req.params.keyword, $options: "i" }
    }).sort({ createdAt: -1 });
    res.json(arrivals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;