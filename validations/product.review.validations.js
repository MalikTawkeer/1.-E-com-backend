import * as Yup from "yup";

// Define the Yup schema for ProductReview
const productReviewSchema = Yup.object().shape({
  review_text: Yup.string()
    .required("Review text is required")
    .min(5, "Review text should be at least 5 characters long"),

  review_rating: Yup.number()
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot be more than 5")
    .default(0),
});

export default productReviewSchema;
