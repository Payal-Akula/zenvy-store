const { Router } = require("express")
const { emailRegex } = require("../utils/regex")
const { sendOtp, verifyOtp } = require("../services/authService")
const User = require("../models/User");
const { generateToken } = require("../services/jwtservice");

const router = Router()

router.post("/otp/send", async (req, res) => {
    try {
        const email = req.body.email
        console.log("📨 Received OTP request for email:", email);
        
        if (!emailRegex.test(email)) {
            console.log("❌ Invalid email format:", email);
            return res.status(400).json({ message: "Invalid email address" });
        }
        
        await sendOtp(email, res);
        
    } catch (error) {
        console.error("❌ Error in /otp/send route:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
});

router.post("/otp/verify", async (req, res) => {
    try {
        const { email, otp, fullName, mobileNumber, password } = req.body;
        
        console.log("📨 Received OTP verification request for:", email);
        console.log("OTP received:", otp);
        console.log("FullName:", fullName);
        console.log("MobileNumber:", mobileNumber);

        // Validate email
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        
        // Validate OTP
        if (!otp || otp.toString().length !== 6 || isNaN(Number(otp))) {
            return res.status(400).json({ message: "Invalid OTP format. Please enter 6 digits." });
        }

        const result = await verifyOtp(email, Number(otp), {
            fullName,
            mobileNumber,
            password
        });

        if (result.token) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 28);
            res.cookie("jwt-token", result.token, { expires: currentDate });
        }

        return res.status(result.statusCode).json({
            message: result.message,
            user: result.user,
            token: result.token,
            statusCode: result.statusCode
        });
        
    } catch (error) {
        console.error("❌ Error in /otp/verify route:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/check", async (req, res) => {
    try {
        const { value } = req.body;
        console.log("🔍 Checking user existence for:", value);

        let user;

        if (/^[0-9]+$/.test(value)) {
            user = await User.findOne({ mobileNumber: Number(value) });
        } else {
            user = await User.findOne({ email: value.toLowerCase() });
        }

        if (user) {
            const token = generateToken({ id: user._id });
            console.log("✅ User found:", user.email);
            return res.json({ 
                exists: true, 
                user,
                token  
            });
        } else {
            console.log("❌ User not found:", value);
            return res.json({ exists: false });
        }

    } catch (error) {
        console.error("❌ Error in /check route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;