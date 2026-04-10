const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGO_DB_URL;  

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("Database is Connected 😀");
    } catch (err) {
        console.log("Failed to Connect DB", err);
    }
}; 

module.exports = connectDB;