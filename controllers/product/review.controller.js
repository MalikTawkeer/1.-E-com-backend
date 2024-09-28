import mongoose from "mongoose";

import CustomerModel from "../../models/customer/customer.model.js";
import ProductReviewModel from "../../models/product/product reviews/product.reviews.model.js";
import ProductModel from "../../models/product/product.model.js";

import ProductReviewValidationSchema from "../../validations/product.review.validations.js";

import { uploadFileOnCloudinary } from "../../services/cloudinary.services.js";
import deleteTempFiles from "../../utils/delete.temp.image.file.js";

// Post product review
const createReview = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await ProductReviewValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { review_text, review_rating, product_id } = req.body;
    const customer_id = req?.user?.id;
    const review_images = [];

    // Check customer exists
    const customer = await CustomerModel.findById(customer_id).session(session);
    if (!customer) return res.status(400).json("Customer not found!");

    // Check product exists
    const product = await ProductModel.findById(product_id);
    if (!product) return res.status(400).json("Product not found!");

    // Store review images if any
    // Handle single review image
    if (req?.files[0]?.path && req?.files?.length === 1) {
      const url = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_review_images"
      );

      // Delete a temp file
      await deleteTempFiles([req?.files[0]]);

      // Error uploading image to cloudinary
      if (!url)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      review_images.push(url);
    }

    //Handle multiple review images
    if (req.files && req.files.length > 1) {
      const urls = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_review_images"
      );

      // Delete temp files
      await deleteTempFiles(req.files);

      // Error in uploadin images to cloudinary
      if (!urls || urls?.length === 0)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      review_images.push(...urls);
    }

    // Store review
    const newReview = await ProductReviewModel({
      review_text,
      review_rating,
      review_images,
      cust_id: customer_id,
      product_id,
    });
    await newReview.save({ session });

    await session.commitTransaction();
    await session.endSession();

    // Success
    return res.status(200).json({ message: "Review created", newReview });

    // validate input data
    // check customer exusts
    // store review images if any
    // store review info into db
    // link customre with review
    // send success response
  } catch (error) {
    console.log(error, "Error while posting product review");
    // delete single file
    if (req.file && req.file.path) await deleteTempFiles([req.file]);
    // Delete multiple files
    if (req.files && req.files.length > 1) await deleteTempFiles(req.files);

    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(error);
  }
};

// Get product review by product id
const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Check product
    const product = await ProductModel.findById(product_id);
    if (!product) return res.status(404).json("Product not found!");

    const reviews = await ProductReviewModel.find({ product_id }).populate({
      path: "cust_id",
      model: "Customer",
      select: "name -_id",
    });

    return res.status(200).json({ product_reviews: reviews });

    // check product id exists
    // retrive neccessary review info
  } catch (error) {
    console.log(error, "Error while retrinving product reviews");
    res.status(500).json(error);
  }
};

// Set review helpful | unhelpful
const markReviewHelpfulOrUnhelpful = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { action } = req.body;
    const customer_id = req?.user?.id;

    const review = await ProductReviewModel.findById(review_id);
    if (!review) return res.status(404).json("Review not found!");

    const hasMarkedHelpful = review.helpful_users.includes(customer_id);
    const hasMarkedUnhelpful = review.unhelpful_users.includes(customer_id);

    if (action === "helpful") {
      // User already marked it as helpful, so we remove the helpful mark
      if (hasMarkedHelpful) {
        review.like_count -= 1;
        review.helpful_users.pop(customer_id); // Remove user from helpful list
      } else {
        // User has marked it as unhelpful before, so remove from unhelpful list
        if (hasMarkedUnhelpful) {
          review.dislike_count -= 1;
          review.unhelpful_users.pop(customer_id);
        }

        // Add the user to the helpful list and increment the like count
        review.like_count += 1;
        review.helpful_users.push(customer_id);
      }
    } else if (action === "unhelpful") {
      if (hasMarkedUnhelpful) {
        review.dislike_count -= 1;
        review.unhelpful_users.pop(customer_id);
      } else {
        if (hasMarkedHelpful) {
          review.like_count -= 1;
          review.helpful_users.pop(customer_id);
        }

        // dislike it
        review.dislike_count += 1;
        review.unhelpful_users.push(customer_id);
      }
    } else return res.status(400).json("Invalid action!!");

    // Save the updated review
    await review.save();

    return res.status(200).json({
      message: `Review marked as ${action}`,
      like_count: review.like_count,
      dislike_count: review.dislike_count,
    });
  } catch (error) {
    console.log(error, "Error while making review helfullness");
    res.status(500).json(error);
  }
};

export { createReview, getProductReviews, markReviewHelpfulOrUnhelpful };
