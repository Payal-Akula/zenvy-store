const User = require("../models/User")
const sgMail = require('@sendgrid/mail')
const dotenv = require("dotenv")
const { generateToken } = require("./jwtservice")

dotenv.config()

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

console.log("📧 Email Service Initialized with SendGrid");
console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Not Set");
console.log("From Email:", process.env.EMAIL ? "✅ Set" : "❌ Not Set");

function sendOtpEmail(email, otp) {
    const msg = {
        to: email,
        from: process.env.EMAIL,
        subject: "Your Zenvy OTP for Secure Login",
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Zenvy</h1>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello,</p>
        
        <p style="font-size: 16px;">We received a request to create an account or sign in to your <strong>Zenvy</strong> account.</p>
        
        <p style="font-size: 16px;">Use the One-Time Password (OTP) below to complete your verification:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #667eea; background: #f5f5f5; padding: 15px; border-radius: 8px; display: inline-block; font-family: monospace;">
                ${otp}
            </div>
        </div>
        
        <p style="font-size: 14px; color: #666;">This OTP is valid for the next <strong>30 minutes</strong>. Please do not share it with anyone for security reasons.</p>
        
        <p style="font-size: 14px; color: #666;">If you did not request this login, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <p style="font-size: 14px; color: #999;">Thanks,<br/>Team Zenvy</p>
    </div>
</body>
</html>
`
    };
    return sgMail.send(msg);
}

// Send an OTP to the specified email address
const sendOtp = async (email, res) => {
    try {
        console.log(`📧 Starting OTP send process for: ${email}`);
        
        const user = await User.findOne({ email });
        const currentTimeStamp = Math.floor(Date.now() / 1000);

        if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            console.log(`⏰ OTP already sent recently for: ${email}`);
            return res.status(400).json({
                message: "An OTP already sent to your email. Please wait 30 minutes."
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

        if (!user.fullName && fullName) {
            user.fullName = fullName;
        }

        if (!user.mobileNumber && mobileNumber) {
            user.mobileNumber = mobileNumber;
        }

        if (!user.password && password) {
            user.password = password;
        }

        user.otp = undefined;
        user.otpExpiry = undefined;
        user.updatedAt = currentTimeStamp;

        await user.save();

        const token = generateToken({
            id: user._id,
            role: user.role || "USER"
        });

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