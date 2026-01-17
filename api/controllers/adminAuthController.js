import Admin from "../models/Admin.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) return next(errorHandler(404, "Admin not found"));

    const validPassword = bcryptjs.compareSync(password, admin.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    const token = jwt.sign(
      { id: admin._id, role: admin.role, permissions: admin.permissions },
      process.env.JWT_SECRET
    );

    const { password: pass, ...adminData } = admin._doc;
    res
      .cookie("admin_token", token, { httpOnly: true })
      .status(200)
      .json(adminData);
  } catch (err) {
    next(err);
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("admin_token").status(200).json("Logged out successfully");
};