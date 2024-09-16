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
    // required: true,
  },
});

// Static method for saving images into product images collection
productImageSchema.statics.saveProductImages = async function (
  imageUrls,
  session = null,
  productId
) {
  try {
    // Format data to be saved
    const imagesToSave = imageUrls.map((url) => ({
      url,
      variant_id: null,
      product_id: productId,
    }));

    // Pass session if provided
    const options = session ? session : {};
    const savedImages = await this.insertMany(imagesToSave, options);

    // Return the generated IDs of the saved images
    return savedImages.map((image) => image._id);
  } catch (error) {
    console.error("Error saving product images:", error);
    throw new Error("Unable to save product images");
  }
};

const ProductImage = mongoose.model("ProductImage", productImageSchema);

export default ProductImage;
