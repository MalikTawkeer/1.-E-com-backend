import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  discount_name: {
    type: String, //Summer sale or winter sale
    required: true,
    unique: true, // Ensures the email is unique
    lowercase: true, // Converts the email to lowercase before saving
    trim: true, // Removes any extra spaces
  },
  discount_type: {
    type: String, // units | percentage
    required: true,
  },

  value: {
    type: String,
    required: true,
  },

  valid_until: {
    type: String,
    required: true,
  },
});

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
