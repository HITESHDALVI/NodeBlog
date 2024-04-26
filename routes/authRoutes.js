const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.COMPANY_PASSWORD,
  },
});
router.get("/", async (req, res) => {
  res.send("user route ");
});
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    res.json({
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_SECRET_KEY
    );

    res.json({
      message: "User Logged in successfully!",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "OTP for verification",
      text: `Your OTP for verification is ${otp}`,
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
      } else {
        const user = await User.findOne({ email });
        if (user) {
          user.otp = otp;
          await user.save();
          res.json({
            message: "OTP send successfully!",
          });
        } else {
          res.status(500).json({
            message: "User does not exist",
          });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(500).json({
        message: "User does not exist",
      });
    }
    if (user.otp !== otp) {
      res.status(500).json({
        message: "OTP Invalid!",
      });
    }
    user.password = new_password;
    user.otp = null;
    await user.save();
    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
