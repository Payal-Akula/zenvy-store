const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/products");
const BestDeals = require("../models/BestDeals");
const NewArrival = require("../models/NewArrival");
const Fashion = require("../models/Fashion");
const Furniture = require("../models/Furniture");
const HealthBeauty = require("../models/HealthBeauty");
const SmartphoneTablet = require("../models/SmartphoneTablet");
const Electronics = require("../models/Electronics");
const Jewelry = require("../models/Jewelry"); // Add this

// ✅ GET CART
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) return res.json({ items: [] });

    const items = await Promise.all(cart.items.map(async (item) => {
      let product = null;
      
      product = await Product.findById(item.productId);
      if (!product) product = await BestDeals.findById(item.productId);
      if (!product) product = await NewArrival.findById(item.productId);
      if (!product) product = await Fashion.findById(item.productId);
      if (!product) product = await Furniture.findById(item.productId);
      if (!product) product = await HealthBeauty.findById(item.productId);
      if (!product) product = await SmartphoneTablet.findById(item.productId);
      if (!product) product = await Electronics.findById(item.productId);
      if (!product) product = await Jewelry.findById(item.productId); // Add this
      
      if (product) {
        return {
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.thumbnail || product.images?.[0],
          quantity: item.quantity
        };
      }
      return null;
    }));

    const validItems = items.filter(item => item !== null);
    res.json({ items: validItems });

  } catch (err) {
    console.error("GET cart error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // Find product in collections
    let product = await Product.findById(productId);
    let source = 'Product';
    
    if (!product) {
      product = await BestDeals.findById(productId);
      source = 'BestDeals';
    }
    if (!product) {
      product = await NewArrival.findById(productId);
      source = 'NewArrival';
    }
    if (!product) {
      product = await Fashion.findById(productId);
      source = 'Fashion';
    }
    if (!product) {
      product = await Furniture.findById(productId);
      source = 'Furniture';
    }
    if (!product) {
      product = await HealthBeauty.findById(productId);
      source = 'HealthBeauty';
    }
    if (!product) {
      product = await SmartphoneTablet.findById(productId);
      source = 'SmartphoneTablet';
    }
    if (!product) {
      product = await Electronics.findById(productId);
      source = 'Electronics';
    }
    if (!product) {
      product = await Jewelry.findById(productId); // Add this
      source = 'Jewelry';
    }
    
    if (!product) {
      console.log("❌ PRODUCT NOT FOUND:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, source }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, source });
      }
    }

    await cart.save();
    res.json({ message: "Added to cart", success: true });

  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE QUANTITY
router.post("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ message: "Updated" });

  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ REMOVE ITEM
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Removed" });

  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ CLEAR CART
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;