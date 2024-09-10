import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema({
  review_text: {
    type: String,
    required: true,
  },

  review_rating: {
    type: Number,
    default: 0,
  },

  like_count: {
    type: Number,
    default: 0,
  },

  dislike_count: {
    type: Number,
    default: 0,
  },

  review_images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewImage",
    },
  ],

  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

const ProductReview = mongoose.model("ProductReview", productReviewSchema);

export default ProductReview;
