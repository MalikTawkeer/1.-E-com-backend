import express from "express";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  editCategory,
} from "../controllers/product/category.controller.js";

import { upload } from "../middlewares/upload.image.multer.js";
import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Add category
router.post(
  "/addProductCategory",
  checkAuth,
  authorize("admin"),
  upload.single("coverImage"),
  addCategory
);

// Get all categories
router.get("/getAllProductCategories", getAllCategories);

// Delete category
router.delete(
  "/deleteProductCategory/:id",
  checkAuth,
  authorize("admin"),
  deleteCategory
);

// Edit category
router.put(
  "/editProductCategory/:id",
  checkAuth,
  authorize("admin"),
  upload.single("coverImage"),
  editCategory
);

export default router;
