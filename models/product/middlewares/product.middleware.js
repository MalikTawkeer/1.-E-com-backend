import mongoose from "mongoose";

// Middleware function to delete related product data
const deleteRelatedProductData = async function (next) {
  const query = this.getQuery(); // Get the query object (e.g., {_id: productId})
  const productId = query._id; // Extract the product ID from the query

  try {
    // // Delete related product discounts
    // await mongoose
    //   .model("ProductDiscount")
    //   .deleteMany({ product_id: productId });

    // Delete related product images
    await mongoose.model("ProductImage").deleteMany({ product_id: productId });

    // // Delete related Product Variant
    // await mongoose
    //   .model("ProductVariant")
    //   .deleteMany({ product_id: productId });

    console.log("middle are", this);

    next();
  } catch (err) {
    next(err);
  }
};

export default deleteRelatedProductData;
