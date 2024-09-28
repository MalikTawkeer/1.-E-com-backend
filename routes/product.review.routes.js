import express from "express";

import authorize from "../middlewares/authorize.middleware.js";
import checkAuth from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.image.multer.js";

import {
  createReview,
  getProductReviews,
  markReviewHelpfulOrUnhelpful,
} from "../controllers/product/review.controller.js";

const router = express.Router();

// Post product review
router.post(
  "/create-review",
  checkAuth,
  authorize("customer"),
  upload.array("files", 20),
  createReview
);

// // Get product reviews by product id
router.get("/product-reviews/:product_id", getProductReviews);

// // help-ful | un-help-ful
router.put(
  "/helpfulness/:review_id",
  checkAuth,
  authorize("customer"),
  markReviewHelpfulOrUnhelpful
);

export default router;
