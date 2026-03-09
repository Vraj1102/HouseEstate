import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import OTP from "../models/OTP.model.js";
import { sendOTPEmail } from "../utils/emailService.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not Found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowercase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been Logged Out!");
  } catch (err) {
    next(err);
  }
};

export const sendPasswordResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.deleteMany({ email, type: 'password_reset' });
    await OTP.create({ email, otp, type: 'password_reset' });
    
    // Try to send email, but don't fail if email service is not configured
    try {
      await sendOTPEmail(email, otp, 'password_reset');
      res.status(200).json({ message: "OTP sent to your email", otp: process.env.NODE_ENV === 'development' ? otp : undefined });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      // In development, return OTP in response if email fails
      if (process.env.NODE_ENV === 'development') {
        res.status(200).json({ message: "Email service unavailable. Your OTP is", otp });
      } else {
        return next(errorHandler(500, "Failed to send OTP. Please contact support."));
      }
    }
  } catch (err) {
    next(err);
  }
};

export const verifyOTPAndResetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const otpRecord = await OTP.findOne({ email, otp, type: 'password_reset' });
    if (!otpRecord) return next(errorHandler(400, "Invalid or expired OTP!"));
    
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));
    
    const hashPassword = bcryptjs.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashPassword });
    
    await OTP.deleteMany({ email, type: 'password_reset' });
    
    res.status(200).json("Password reset successfully!");
  } catch (err) {
    next(err);
  }
};
