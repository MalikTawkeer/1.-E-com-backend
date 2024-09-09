import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },

  size: {
    type: String,
    required: true,
  },

  price: { type: Number }, // Optional: Price for this variant

  stock: { type: Number, required: true }, // Stock for this variant

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const ProductVariant = mongoose.model("ProductVariant", variantSchema);

export default ProductVariant;
