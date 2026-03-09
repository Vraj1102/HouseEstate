import express from "express";
import { createPaymentIntent, createPayment, getUserPayments, getPaymentById } from "../controllers/paymentController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/create", verifyToken, createPayment);
router.get("/user", verifyToken, getUserPayments);
router.get("/:id", verifyToken, getPaymentById);

export default router;