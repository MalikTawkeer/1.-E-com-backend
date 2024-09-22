import express from "express";

import {
  addDiscount,
  deleteDiscount,
  getAllDiscounts,
  updateDiscount,
} from "../controllers/product/discount.controller.js";

import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/addDiscount", checkAuth, authorize("admin"), addDiscount);

router.put(
  "/updateDiscountById/:id",
  checkAuth,
  authorize("admin"),
  updateDiscount
);

router.get("/getAllDiscounts", checkAuth, authorize("admin"), getAllDiscounts);

router.delete(
  "/deleteDiscount/:id",
  checkAuth,
  authorize("admin"),
  deleteDiscount
);

export default router;
