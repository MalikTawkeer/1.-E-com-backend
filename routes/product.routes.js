import e from "express";

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product/product.controller.js";
import { upload } from "../middlewares/upload.image.multer.js";

const router = e.Router();

// Add product
router.post("/addProduct", upload.array("files", 20), addProduct);

// List all products
router.get("/getAllProducts", getAllProducts);

// Get product info by id
router.get("/getProductInfoById/:id", getProductById);

// delete product  by id
router.delete("/deleteProductById/:id", deleteProduct);

// Update procut by id
router.put("/updateProduct/:id", upload.array("files", 20), updateProduct);

export default router;
