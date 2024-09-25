import e from "express";

import {
  addShippingAddress,
  deleteShippingAddress,
  getShippingAddresses,
  updateShippingAddress,
} from "../controllers/customer/shipping.address.controller.js";

import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = e.Router();

router.post("/add", checkAuth, authorize("customer"), addShippingAddress);

router.get(
  "/addresses",
  checkAuth,
  authorize("customer"),
  getShippingAddresses
);

router.put("/update/:id", updateShippingAddress);

router.delete("/delete/:id", deleteShippingAddress);

export default router;
