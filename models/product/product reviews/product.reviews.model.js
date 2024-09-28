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
      type: String,
    },
  ],

  helpful_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Track users who marked helpful
    },
  ],

  unhelpful_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Track users who marked unhelpful
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

const ProductReview = mongoose.model("Product_Review", productReviewSchema);

export default ProductReview;
