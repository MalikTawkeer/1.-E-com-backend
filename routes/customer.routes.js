import express from "express";

import {
  login,
  register,
  viewProfile,
  updateProfile,
} from "../controllers/customer/customer.controller.js";

import authenticateJWT from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Signup customer
router.post("/register", register);

// Login customer
router.post("/login", login);

// View Profile by id
router.get(
  "/view-profile/:id",
  authenticateJWT,
  authorize("customer"),
  viewProfile
);

// Update profile by id
router.put(
  "/update-profile/:id",
  authenticateJWT,
  authorize("customer"),
  updateProfile
);

export default router;
