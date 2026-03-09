import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/Listing.model.js";
import OTP from "../models/OTP.model.js";
import { sendOTPEmail } from "../utils/emailService.js";

export const test = (req, res) => {
  res.json({
    message: "Hello world",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    if (req.body.password) {
      updateData.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

export const sendDeleteAccountOTP = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.deleteMany({ email: user.email, type: 'account_deletion' });
    await OTP.create({ email: user.email, otp, type: 'account_deletion' });
    
    try {
      await sendOTPEmail(user.email, otp, 'account_deletion');
      res.status(200).json({ message: "OTP sent to your email", otp: process.env.NODE_ENV === 'development' ? otp : undefined });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
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

export const verifyOTPAndDeleteAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    const { otp } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));
    
    const otpRecord = await OTP.findOne({ email: user.email, otp, type: 'account_deletion' });
    if (!otpRecord) return next(errorHandler(400, "Invalid or expired OTP!"));
    
    await User.findByIdAndDelete(req.params.id);
    await OTP.deleteMany({ email: user.email, type: 'account_deletion' });
    res.clearCookie("access_token");
    res.status(200).json("Account deleted successfully!");
  } catch (err) {
    next(err);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (err) {
      next(err);
    }
  } else {
    return next(errorHandler(401, "you can only view your own listings"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not Found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
