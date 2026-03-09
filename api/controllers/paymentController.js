import Payment from "../models/Payment.model.js";
import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/error.js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return next(errorHandler(500, "Stripe not configured"));
    }
    
    const { listingId, paymentType } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    const percentage = paymentType === "token" ? 0.1 : 0.2;
    const amount = Math.round(listing.regularPrice * percentage * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        listingId: listingId,
        userId: req.user.id,
        paymentType,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
    });
  } catch (err) {
    next(err);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { listingId, amount, paymentType, paymentMethod, paymentIntentId } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    const transactionId = paymentIntentId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = await Payment.create({
      listingId,
      userId: req.user.id,
      amount,
      paymentType,
      paymentMethod,
      transactionId,
      status: "completed",
    });

    // Update listing status
    const newStatus = paymentType === "token" ? "token_paid" : "sold";
    await Listing.findByIdAndUpdate(listingId, {
      paymentStatus: newStatus,
      paidBy: req.user.id,
    });

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

export const getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate("listingId")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("listingId");
    if (!payment) return next(errorHandler(404, "Payment not found"));
    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};