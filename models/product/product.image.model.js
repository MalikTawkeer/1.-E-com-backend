import mongoose, { mongo } from "mongoose";

const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const ProductImage = mongoose.model("ProductImage", productImageSchema);

export default ProductImage;
