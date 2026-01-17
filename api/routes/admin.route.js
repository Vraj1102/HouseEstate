import express from "express";
import {
  getDashboard,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDashboard);

// User routes
router.get("/users", verifyAdmin, getAllUsers);
router.get("/users/:id", verifyAdmin, getUser);
router.post("/users", verifyAdmin, createUser);
router.put("/users/:id", verifyAdmin, updateUser);
router.delete("/users/:id", verifyAdmin, deleteUser);

// Listing routes
router.get("/listings", verifyAdmin, getAllListings);
router.get("/listings/:id", verifyAdmin, getListing);
router.post("/listings", verifyAdmin, createListing);
router.put("/listings/:id", verifyAdmin, updateListing);
router.delete("/listings/:id", verifyAdmin, deleteListing);

export default router;