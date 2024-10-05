import mongoose from "mongoose";

import deleteRelatedProductData from "./middlewares/product.middleware.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  discount: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Discount",
  }, // Refrences to disoucnts table

  description: {
    type: String,
    required: true,
  },

  sales_count: {
    type: Number,
    default: 0,
  },

  product_images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductImage",
      required: true,
    },
  ],

  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  ],

  stock: {
    type: Number,
    required: true,
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ProductCategory",
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

// Attach hook for cascade deletion
// / Use the appropriate hooks for deletion
productSchema.pre("findOneAndDelete", deleteRelatedProductData);
productSchema.pre("deleteOne", deleteRelatedProductData);

const Product = mongoose.model("Product", productSchema);

export default Product;
