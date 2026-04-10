// auth/otp/send
const { Router } = require("express")
const { emailRegex } = require("../utils/regex")
const { sendOtp, verifyOtp } = require("../services/authservice")
const User = require("../models/User");
const { generateToken } = require("../services/jwtservice");

const router = Router()

router.post("/otp/send", (req, res) => {
    const email = req.body.email
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email Adress" })

    }
    sendOtp(email, res)
})

router.post("/otp/verify", async (req, res) => {
    const { email, otp, fullName, mobileNumber, password } = req.body;

    if (!emailRegex.test(email) || !otp || otp.length !== 6 || isNaN(Number(otp))) {
        return res.status(400).json({ message: "Invalid Payload" });
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

    res.status(result.statusCode).json({
        message: result.message,
        user: result.user,
        token: result.token
    })
});
router.post("/check", async (req, res) => {
  try {
    const { value } = req.body;

    let user;

    if (/^[0-9]+$/.test(value)) {
      user = await User.findOne({ mobileNumber: Number(value) });
    } else {
      user = await User.findOne({ email: value.toLowerCase() });
    }

    if (user) {
      const token = generateToken({ id: user._id });

      return res.json({ 
        exists: true, 
        user,
        token  
      });
    } else {
      return res.json({ exists: false });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router