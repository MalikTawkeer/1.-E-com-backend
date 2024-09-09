import mongoose from "mongoose";

// Middleware function to delete related product data
const deleteRelatedProductData = async function (next) {
  const productId = this._id;

  try {
    // Delete related product discounts
    await mongoose
      .model("ProductDiscount")
      .deleteMany({ product_id: productId });

    // Delete related product images
    await mongoose.model("ProductImage").deleteMany({ product_id: productId });

    // Delete related Product Variant
    await mongoose
      .model("ProductVariant")
      .deleteMany({ product_id: productId });

    next();
  } catch (err) {
    next(err);
  }
};

export default deleteRelatedProductData;
