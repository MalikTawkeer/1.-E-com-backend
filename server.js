import express from "express";

import productCategoryRoutes from "./routes/product.category.routes.js";

import connectDB from "./config/db.js";

const app = express();

connectDB();

// app.use(cookieParser());
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", productCategoryRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
