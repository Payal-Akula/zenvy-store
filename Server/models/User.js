const mongoose = require("mongoose");
const { emailRegex } = require("../utils/regex");
const { USER_ROLES } = require("../contants");



const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    mobileNumber: Number,
    password: String,
     wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    otp: Number,
    otpExpiry: Number,
    createdAt: Number,
    updatedAt: Number,
});

module.exports = model("User", userSchema);