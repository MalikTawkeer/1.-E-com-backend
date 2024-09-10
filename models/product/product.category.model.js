import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: { type: String, required: true },

  category_icon: {
    type: String,
    required: true,
  },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

export default ProductCategory;