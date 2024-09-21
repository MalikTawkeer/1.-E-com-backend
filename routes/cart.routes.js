import express from "express";
import {
  addToCart,
  removeItemFromCart,
  updateCartItemQnty,
  getCart
} from "../controllers/cart/cart.controller.js";

const router = express.Router();

// Add item into a Cart
router.post("/add", addToCart);

// Get cart items
router.get("/items/:customer_id", getCart);

// // Remove item from Cart
router.delete("/remove/:cart_item_id", removeItemFromCart);

// // Increment or Decrement cart
router.put("/update/:cart_item_id", updateCartItemQnty);

export default router;
