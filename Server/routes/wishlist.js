const { Router } = require("express");
const User = require("../models/User");

const router = Router();

// add
router.post("/add", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (exists) {
            return res.json({ message: "Already exists" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.json({ message: "Added to wishlist", wishlist: user.wishlist });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get - REMOVED .populate() to just return the IDs
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        // Removed .populate("wishlist") - just return the IDs

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// remove
router.post("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        res.json({ message: "Removed from wishlist" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;