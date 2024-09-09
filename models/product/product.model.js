import mongoose from "mongoose";

import deleteRelatedProductData from "./middlewares/product.middleware";

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

  product_images: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductImage" },
  ],

  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  ],

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
productSchema.pre("remove", deleteRelatedProductData);

const Product = mongoose.model("Product", productSchema);

export default Product;
