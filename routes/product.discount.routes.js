import express from "express";

import {
  addDiscount,
  deleteDiscount,
  getAllDiscounts,
  getProductsByDiscountId,
  updateDiscount,
} from "../controllers/product/discount.controller.js";

import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/add", checkAuth, authorize("admin"), addDiscount);

router.put("/update/:id", checkAuth, authorize("admin"), updateDiscount);

router.get("/discounts", checkAuth, authorize("admin"), getAllDiscounts);

router.delete("/delete/:id", checkAuth, authorize("admin"), deleteDiscount);

// Get products by discount id
router.get("/products/:discount_id", getProductsByDiscountId);

export default router;
