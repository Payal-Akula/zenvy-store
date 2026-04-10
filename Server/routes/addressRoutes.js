const express = require("express");
const router = express.Router();

const Address = require("../models/Address");
const { authenticationMiddleware } = require("../middleware/midauth");


router.post("/", authenticationMiddleware, async (req, res) => {
  try {
    const data = req.body;

    if (data.isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      ...data,
      userId: req.user.id
    });

    res.status(201).json(address);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", authenticationMiddleware, async (req, res) => {
  const addresses = await Address.find({ userId: req.user.id })
    .sort({ isDefault: -1 });

  res.json(addresses);
});

router.delete("/:id", authenticationMiddleware, async (req, res) => {
  await Address.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  res.json({ message: "Deleted" });
});


router.put("/:id", authenticationMiddleware, async (req, res) => {
  const data = req.body;

  if (data.isDefault) {
    await Address.updateMany(
      { userId: req.user.id },
      { isDefault: false }
    );
  }

  const updated = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    data,
    { new: true }
  );

  res.json(updated);
});

module.exports = router