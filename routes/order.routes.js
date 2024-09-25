import e from "express";

import {
  placeOrder,
  getOrderHistory,
  viewOrder,
  cancelOrder,
} from "../controllers/order/order.controller.js";

import authorize from "../middlewares/authorize.middleware.js";
import checkAuth from "../middlewares/auth.middleware.js";

const router = e.Router();

// Place order
router.post("/place-order", checkAuth, authorize("customer"), placeOrder);

// Order history
router.get("/order-history", checkAuth, authorize("customer"), getOrderHistory);

// View single order info
router.get(
  "/order-details/:order_id",
  checkAuth,
  authorize("customer"),
  viewOrder
);

// Cancel order
router.delete(
  "/cancel-order/:order_id",
  checkAuth,
  authorize("customer"),
  cancelOrder
);

export default router;
