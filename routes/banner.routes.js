import express from "express";

import {
  addBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../controllers/banner.controller.js";

import { upload } from "../middlewares/upload.image.multer.js";
import checkAdmin from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post(
  "/add",
  checkAdmin,
  authorize("admin"),
  upload.single("bannerImage"),
  addBanner
);

router.get("/banners", checkAdmin, authorize("admin"), getBanners);

router.put(
  "/update/:banner_id",
  checkAdmin,
  authorize("admin"),
  upload.single("bannerImage"),
  updateBanner
);

router.delete(
  "/delete/:banner_id",
  checkAdmin,
  authorize("admin"),
  deleteBanner
);

export default router;
