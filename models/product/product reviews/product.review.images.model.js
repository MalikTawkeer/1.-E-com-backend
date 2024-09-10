import mongoose from "mongoose";

const ProductReviewImage = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  review_id: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const ReviewImage = mongoose.model("ReviewImage", ProductReviewImage);

export default ReviewImage;
