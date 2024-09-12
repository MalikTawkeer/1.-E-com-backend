import express from "express";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  editCategory,
} from "../controllers/product/category.controller.js";

import { upload } from "../middlewares/upload.image.multer.js";

const router = express.Router();

// Add category
router.post("/addProductCategory", upload.single("coverImage"), addCategory);

// Get all categories
router.get("/getAllProductCategories", getAllCategories);

// Delete category
router.delete("/deleteProductCategory/:id", deleteCategory);

// Edit category
router.put(
  "/editProductCategory/:id",
  upload.single("coverImage"),
  editCategory
);

export default router;
