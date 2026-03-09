import express from "express";
import {
  test,
  updateUser,
  sendDeleteAccountOTP,
  verifyOTPAndDeleteAccount,
  getUserListings,
  getUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.post("/send-delete-otp/:id", verifyToken, sendDeleteAccountOTP);
router.post("/verify-delete-otp/:id", verifyToken, verifyOTPAndDeleteAccount);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

export default router;
