const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET = process.env.JWT_SECRET_KEY;

if (!SECRET) {
    throw new Error("JWT_SECRET_KEY is missing in .env file");
}

function generateToken(claims) {
    return jwt.sign(claims, SECRET, { expiresIn: "4w" });
}

function verifyTokens(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        console.log("Token Verification Failed:", error.message);
        return null;
    }
}

module.exports = { generateToken, verifyTokens };