import express from "express";
import {
  signup,
  signin,
  google,
  signout,
  sendPasswordResetOTP,
  verifyOTPAndResetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.post("/send-reset-otp", sendPasswordResetOTP);
router.post("/verify-otp-reset-password", verifyOTPAndResetPassword);

export default router;
