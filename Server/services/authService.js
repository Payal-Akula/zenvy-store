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
    console.log(`📧 Preparing email with OTP: ${otp} for: ${email}`);
    
    const msg = {
        to: email,
        from: process.env.EMAIL,
        subject: "🔐 Your Zenvy OTP Verification Code",
        text: `
Hello,

Your OTP (One-Time Password) for Zenvy account verification is:

${otp}

This OTP is valid for the next 10 minutes.

If you didn't request this, please ignore this email.

Thanks,
Team Zenvy
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; background-color: #e12727; padding: 20px; border-radius: 10px 10px 0 0; margin: -20px -20px 0 -20px;">
            <h1 style="color: white; margin: 0;">Zenvy</h1>
        </div>
        
        <div style="padding: 20px;">
            <p style="font-size: 16px;">Hello,</p>
            
            <p style="font-size: 16px;">Your OTP for account verification is:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #e12727; background: #f0f0f0; padding: 15px; border-radius: 8px; display: inline-block;">
                    ${otp}
                </div>
            </div>
            
            <p style="font-size: 14px; color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
            
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #999;">Thanks,<br/>Team Zenvy</p>
        </div>
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
        
        let user = await User.findOne({ email });
        const currentTimeStamp = Math.floor(Date.now() / 1000);

        // FIXED: Better check for existing valid OTP
        if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            console.log(`⏰ OTP already valid for ${email}. Expires in ${user.otpExpiry - currentTimeStamp} seconds`);
            
            // Instead of error, resend with new OTP but clear old one
            console.log(`🔄 Clearing old OTP and sending new one...`);
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = currentTimeStamp + 600; // 10 minutes (600 seconds)
        
        console.log(`🔢 Generated OTP: ${otp} for: ${email}`);
        console.log(`⏰ OTP will expire at: ${new Date(otpExpiry * 1000).toLocaleTimeString()}`);

        // Send email first
        try {
            await sendOtpEmail(email, otp);
            console.log(`✅ Email sent successfully to: ${email}`);
        } catch (emailError) {
            console.error(`❌ Failed to send email to ${email}:`, emailError.message);
            return res.status(500).json({ 
                message: "Failed to send OTP email. Please check your email configuration." 
            });
        }

        // Save or update OTP in database
        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
            console.log(`💾 OTP updated for existing user: ${email}`);
        } else {
            // Create new user with only email (incomplete registration)
            user = await User.create({
                email,
                otp,
                otpExpiry,
                createdAt: currentTimeStamp,
                updatedAt: currentTimeStamp
            });
            console.log(`💾 New temporary user created with OTP: ${email}`);
        }

        return res.status(200).json({ 
            message: "OTP Sent Successfully! Please check your email inbox or spam folder.",
            email: email
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
        
        let user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return { statusCode: 404, message: "User not found. Please sign up again." };
        }

        if (!user.otp) {
            console.log(`❌ No OTP found for: ${email}`);
            // Clear this invalid user and ask to signup again
            await User.deleteOne({ email });
            return { statusCode: 404, message: "Session expired. Please sign up again." };
        }

        const currentTimeStamp = Math.floor(Date.now() / 1000);
        
        console.log(`⏰ Current time: ${new Date(currentTimeStamp * 1000).toLocaleTimeString()}`);
        console.log(`⏰ OTP expiry: ${new Date(user.otpExpiry * 1000).toLocaleTimeString()}`);
        console.log(`⏰ Time remaining: ${user.otpExpiry - currentTimeStamp} seconds`);

        // Check if OTP is expired
        if (user.otpExpiry < currentTimeStamp) {
            console.log(`⏰ OTP EXPIRED for: ${email}`);
            // Clear expired OTP and user
            await User.deleteOne({ email });
            return {
                statusCode: 410,
                message: "OTP has expired. Please sign up again.",
                expired: true
            };
        }

        // Check if OTP matches
        if (user.otp !== Number(otp)) {
            console.log(`❌ Invalid OTP for: ${email}. Expected: ${user.otp}, Got: ${otp}`);
            return { statusCode: 400, message: "Invalid OTP. Please try again." };
        }

        console.log(`✅ OTP verified successfully for: ${email}`);

        const { fullName, mobileNumber, password } = extraData;

        // Update user data (complete registration)
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

        // Clear OTP data (important for security)
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.updatedAt = currentTimeStamp;

        await user.save();
        console.log(`💾 User fully registered for: ${email}`);

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