import express from "express";

import productCategoryRoutes from "./routes/product.category.routes.js";
import productRoutes from "./routes/product.routes.js";
import discountRoutes from "./routes/product.discount.routes.js";

import connectDB from "./config/db.js";

const app = express();

connectDB();

// app.use(cookieParser());
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", productCategoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", discountRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
