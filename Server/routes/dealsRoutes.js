const express = require("express");
const router = express.Router();
const BestDeals = require("../models/BestDeals");
const mongoose = require("mongoose");

// Function to extend expired deals by 10 days
const extendExpiredDeals = async () => {
  try {
    const now = new Date();
    
    // Find all expired deals
    const expiredDeals = await BestDeals.find({
      dealEnd: { $lt: now }
    });
    
    if (expiredDeals.length > 0) {
      console.log(`Found ${expiredDeals.length} expired deals. Extending by 10 days...`);
      
      for (const deal of expiredDeals) {
        const newEndDate = new Date(deal.dealEnd);
        newEndDate.setDate(newEndDate.getDate() + 10);
        

        const newStartDate = new Date();
        
        await BestDeals.findByIdAndUpdate(deal._id, {
          dealStart: newStartDate,
          dealEnd: newEndDate,
          updatedAt: now
        });
        
        console.log(`Extended deal "${deal.title}" until ${newEndDate}`);
      }
    }
  } catch (err) {
    console.error("Error extending deals:", err);
  }
};

// Auto-extend deals when the server starts
const startAutoExtension = () => {
  // Check and extend deals every hour
  setInterval(async () => {
    await extendExpiredDeals();
  }, 60 * 60 * 1000); // Check every hour
  
  console.log("Auto-deal extension service started (checks every hour)");
};

// GET ALL DEALS (with auto-extension check before returning)
router.get("/", async (req, res) => {
  try {
    // Check and extend expired deals before returning
    await extendExpiredDeals();
    
    const deals = await BestDeals.find().sort({ discountPercentage: -1, createdAt: -1 }).limit(30);
    res.json(deals);
  } catch (err) {
    console.error("Error fetching deals:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ACTIVE DEALS (with auto-extension check)
router.get("/deals", async (req, res) => {
  try {
    // Check and extend expired deals before returning
    await extendExpiredDeals();
    
    const now = new Date();
    const deals = await BestDeals.find({
      dealStart: { $lte: now },
      dealEnd: { $gt: now }
    }).limit(10);

    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.q;
    const deals = await BestDeals.find({
      title: { $regex: keyword, $options: "i" },
    });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const paramId = req.params.id;
    let deal = null;

    if (mongoose.Types.ObjectId.isValid(paramId)) {
      deal = await BestDeals.findById(paramId);
    }

    if (!deal) {
      deal = await BestDeals.findOne({ id: paramId });
    }

    if (!deal) {
      deal = await BestDeals.findOne({
        title: { $regex: new RegExp(`^${paramId}$`, "i") },
      });
    }

    if (!deal) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the auto-extension service when the route is loaded
startAutoExtension();

module.exports = router;