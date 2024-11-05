import express from "express";
import {
  addToCart,
  removeItemFromCart,
  updateCartItemQnty,
  getCart,
  addItemsToCart,
} from "../controllers/cart/cart.controller.js";

import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Add item into a Cart
router.post("/add", checkAuth, authorize("customer"), addToCart);

// Add item into a Cart
router.post("/add-all", checkAuth, authorize("customer"), addItemsToCart);

// Get cart items
router.get("/items", checkAuth, authorize("customer"), getCart);

// // Remove item from Cart
router.delete(
  "/remove/:cart_item_id",
  checkAuth,
  authorize("customer"),
  removeItemFromCart
);

// // Increment or Decrement cart
router.put(
  "/update/:cart_item_id",
  checkAuth,
  authorize("customer"),
  updateCartItemQnty
);

export default router;
