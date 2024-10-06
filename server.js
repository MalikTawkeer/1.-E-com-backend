import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import connectDB from "./config/db.js";

import adminRoutes from "./routes/admin.routes.js";
import productCategoryRoutes from "./routes/product.category.routes.js";
import productRoutes from "./routes/product.routes.js";
import discountRoutes from "./routes/product.discount.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import shippingRoutes from "./routes/shipping.address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productReviewRoutes from "./routes/product.review.routes.js";
import bannerRoutes from "./routes/banner.routes.js";

const app = express();

// Rate limiter config
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 25,
  message: "Too many requests from this IP, please try again later",
});

connectDB();

// Cors
app.use(
  cors({
    origin: "http://localhost:5173", // any urls
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// apply rate limiter to all routes
app.use(limiter);
app.use(helmet());

// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", customerRoutes);
app.use("/api/v1", productCategoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1/discount", discountRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/shipping-address", shippingRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/product-review", productReviewRoutes);
app.use("/api/v1/banner", bannerRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
