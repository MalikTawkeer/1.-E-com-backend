import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const CustomerAddress = mongoose.model("CustomerAddress", addressSchema);

export default CustomerAddress;
