import express from "express";
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/admin.routes.js";
import productCategoryRoutes from "./routes/product.category.routes.js";
import productRoutes from "./routes/product.routes.js";
import discountRoutes from "./routes/product.discount.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import connectDB from "./config/db.js";

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", customerRoutes);
app.use("/api/v1", productCategoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", discountRoutes);
app.use("/api/v1/cart", cartRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
