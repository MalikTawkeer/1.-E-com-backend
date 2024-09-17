import express from "express";

import {
  login,
  register,
  viewProfile,
  updateProfile,
} from "../controllers/customer/customer.controller.js";

const router = express.Router();

// Signup customer
router.post("/register", register);

// Login customer
router.post("/login", login);

// View Profile by id
router.get("/view-profile/:id", viewProfile);

// Update profile by id
router.put("/update-profile/:id", updateProfile);

export default router;
