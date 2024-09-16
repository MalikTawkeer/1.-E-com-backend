import express from "express";

import {
  addDiscount,
  deleteDiscount,
  getAllDiscounts,
  updateDiscount,
} from "../controllers/product/discount.controller.js";

const router = express.Router();

router.post("/addDiscount", addDiscount);

router.put("/updateDiscountById/:id", updateDiscount);

router.get("/getAllDiscounts", getAllDiscounts);

router.delete("/deleteDiscount/:id", deleteDiscount);

export default router;
