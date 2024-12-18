import e from "express";

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductByCategoryId,
  getProductsByDiscountId,
} from "../controllers/product/product.controller.js";

import { upload } from "../middlewares/upload.image.multer.js";
import checkAuth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = e.Router();

// Add product
router.post(
  "/addProduct",
  checkAuth,
  authorize("admin"),
  upload.array("files", 20),
  addProduct
);

// List all products
router.get("/getAllProducts", getAllProducts);

// Get product info by id
router.get("/getProductInfoById/:id", getProductById);

// delete product  by id
router.delete(
  "/deleteProductById/:id",
  checkAuth,
  authorize("admin"),
  deleteProduct
);

// Update procut by id
router.put(
  "/updateProduct/:id",
  checkAuth,
  authorize("admin"),
  upload.array("files", 20),
  updateProduct
);

// Get producsts by category id
router.get("/products/category/:category_id", getProductByCategoryId);

// Get products by Discount _D
router.get("/products/discount/:discount_id", getProductsByDiscountId);

export default router;
