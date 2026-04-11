const User = require("../models/User")
const sgMail = require('@sendgrid/mail')
const dotenv = require("dotenv")
const { generateToken } = require("./jwtservice")

dotenv.config()

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API)

console.log("📧 Email Service Initialized with SendGrid");
console.log("SendGrid API Key:", process.env.SENDGRID_API ? "✅ Set" : "❌ Not Set");
console.log("From Email:", process.env.EMAIL ? "✅ Set" : "❌ Not Set");

function sendOtpEmail(email, otp) {
    const msg = {
        to: email,
        from: process.env.EMAIL,
        subject: "Your Zenvy OTP for Secure Login",
        html: `...` // Your HTML template (same as before)
    };
    return sgMail.send(msg);
}

// Send an OTP to the specified email address
const sendOtp = async (email, res) => {
    try {
        console.log(`📧 Starting OTP send process for: ${email}`);
        
        const user = await User.findOne({ email });
        const currentTimeStamp = Math.floor(Date.now() / 1000);

        // Check if OTP already sent and still valid
        if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            console.log(`⏰ OTP already sent recently for: ${email}`);
            // Don't return error - just let them know
            return res.status(200).json({
                message: "OTP already sent to your email. Please check your inbox."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = currentTimeStamp + 1800;
        
        console.log(`🔢 Generated OTP: ${otp} for: ${email}`);

        // Send email using SendGrid
        try {
            await sendOtpEmail(email, otp);
            console.log(`✅ Email sent successfully to: ${email}`);
        } catch (emailError) {
            console.error(`❌ Failed to send email to ${email}:`, emailError.message);
            return res.status(500).json({ 
                message: "Failed to send OTP email. Please try again later." 
            });
        }

        // Save OTP to database
        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
            console.log(`💾 OTP saved for existing user: ${email}`);
        } else {
            await User.create({
                email,
                otp,
                otpExpiry,
                createdAt: currentTimeStamp,
                updatedAt: currentTimeStamp
            });
            console.log(`💾 New user created with OTP: ${email}`);
        }

        return res.status(200).json({ 
            message: "OTP Sent Successfully! Please check your email inbox or spam folder." 
        });

    } catch (error) {
        console.error("❌ An error occurred while sending OTP:", error.message);
        return res.status(500).json({ 
            message: "Internal server error: " + error.message 
        });
    }
};

// Verify OTP and complete registration
const verifyOtp = async (email, otp, extraData = {}) => {
    try {
        console.log(`🔐 Verifying OTP for: ${email}, OTP: ${otp}`);
        console.log(`📦 Extra data received:`, extraData);
        
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return { statusCode: 404, message: "User not found" };
        }

        if (!user.otp) {
            console.log(`❌ No OTP found for: ${email}`);
            return { statusCode: 404, message: "OTP not found, please request a new OTP." };
        }

        const currentTimeStamp = Math.floor(Date.now() / 1000);

        if (user.otpExpiry < currentTimeStamp) {
            console.log(`⏰ OTP expired for: ${email}`);
            return {
                statusCode: 410,
                message: "OTP expired, please request a new one."
            };
        }

        if (user.otp !== Number(otp)) {
            console.log(`❌ Invalid OTP for: ${email}. Expected: ${user.otp}, Got: ${otp}`);
            return { statusCode: 400, message: "Invalid OTP. Please try again." };
        }

        console.log(`✅ OTP verified successfully for: ${email}`);

        const { fullName, mobileNumber, password } = extraData;

        // Update user data
        if (fullName) {
            user.fullName = fullName;
            console.log(`📝 Updated fullName: ${fullName}`);
        }

        if (mobileNumber) {
            user.mobileNumber = mobileNumber;
            console.log(`📝 Updated mobileNumber: ${mobileNumber}`);
        }

        if (password) {
            user.password = password;
            console.log(`📝 Updated password`);
        }

        // Clear OTP data
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.updatedAt = currentTimeStamp;

        await user.save();
        console.log(`💾 User data saved for: ${email}`);

        // Generate JWT token
        const token = generateToken({
            id: user._id,
            role: user.role || "USER"
        });

        console.log(`🎫 Token generated for user: ${email}`);

        return {
            statusCode: 200,
            message: "Account verified and created successfully!",
            token,
            user
        };

    } catch (error) {
        console.error("❌ Error in verifyOtp:", error.message);
        return { statusCode: 500, message: error.message };
    }
};

module.exports = { sendOtp, verifyOtp };