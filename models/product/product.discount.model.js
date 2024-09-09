import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  discount_type: {
    type: String, // units | percentage
    required: true,
  },

  value: {
    type: String,
    required: true,
  },

  valid_until: {
    type: Date,
    required: true,
  },
});

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
