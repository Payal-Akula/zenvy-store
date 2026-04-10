const User = require("../models/User")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const { generateToken } = require("./jwtservice")

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
})
function sendOtpEmail(email, otp) {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your Zenvy OTP for Secure Login",
        html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Hi,</p>

    <p>We received a request to sign in to your <b>Zenvy</b> account.</p>

    <p>Use the One-Time Password (OTP) below to complete your login:</p>

    <h2 style="letter-spacing: 2px; color: #000;">${otp}</h2>

    <p>This OTP is valid for the next <b>30 minutes</b>. Please do not share it with anyone for security reasons.</p>

    <p>If you did not request this login, you can safely ignore this email.</p>

    <br/>

    <p>Thanks,<br/>Team Zenvy</p>
  </div>
`
    })
}

//send an OTP to the specified email address
const sendOtp = async (email, res) => {
    try {
        const user = await User.findOne({ email });

        const currentTimeStamp = Math.floor(Date.now() / 1000);

        if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            return res.status(400).json({
                message: "An OTP already sent to your email"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = currentTimeStamp + 1800;

        await sendOtpEmail(email, otp);

        if (user) {
            console.log("OTP sent for existing user", otp);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            console.log("OTP sent for new user", otp);
            await User.create({
                email,
                otp,
                otpExpiry,
                createdAt: currentTimeStamp,
                updatedAt: currentTimeStamp
            });
        }

        res.status(200).json({ message: "OTP Sent Successfully!" });

    } catch (error) {
        console.log("An error occurred while sending OTP", error.message);
        res.status(500).json({ message: error.message });
    }
};

//{statusCode: 404|401|200 , message:" ", token?:}
const verifyOtp = async (email, otp, extraData = {}) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return { statusCode: 404, message: "User not found" };
        }

        if (!user.otp) {
            return { statusCode: 404, message: "OTP not found, please send an OTP." };
        }

        const currentTimeStamp = Math.floor(Date.now() / 1000);

        if (user.otpExpiry < currentTimeStamp) {
            return {
                statusCode: 410,
                message: "OTP expired, please send another one."
            };
        }

        if (user.otp !== Number(otp)) {
            return { statusCode: 400, message: "Invalid OTP" };
        }


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
            message: "Account created successfully",
            token,
            user
        };

    } catch (error) {
        return { statusCode: 500, message: error.message };
    }
};

module.exports = { sendOtp, verifyOtp }