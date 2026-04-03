import User from "../models/User.model.js";
import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalListings = await Listing.countDocuments();
    const recentUsers = await User.find({ role: "user" }).sort({ createdAt: -1 }).limit(5).select("-password");
    const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalListings,
      recentUsers,
      recentListings,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).json(rest);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Listing.deleteMany({ userRef: req.params.id });
    res.status(200).json("User and listings deleted");
  } catch (err) {
    next(err);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate('userRef', 'username email').sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('userRef', 'username email');
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const { ownerName, ...listingData } = req.body;
    
    // Find user by username or email
    let user = null;
    if (ownerName) {
      user = await User.findOne({
        $or: [
          { username: ownerName },
          { email: ownerName }
        ]
      });
    }
    
    // If no user found, use admin's ID
    const userRef = user ? user._id : req.user.id;
    
    // For rent properties, ensure no offers
    const finalData = listingData.type === 'rent'
      ? { ...listingData, userRef, offer: false, discountPrice: 0 }
      : { ...listingData, userRef };
    
    const listing = await Listing.create(finalData);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { ownerName, ...listingData } = req.body;
    
    // For rent properties, ensure no offers
    const finalData = listingData.type === 'rent'
      ? { ...listingData, offer: false, discountPrice: 0 }
      : listingData;
    
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      finalData,
      { new: true }
    );
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing deleted");
  } catch (err) {
    next(err);
  }
};