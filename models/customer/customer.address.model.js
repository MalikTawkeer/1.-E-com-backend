import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },

  pincode: {
    type: Number,
    required: true,
  },

  village: {
    type: String,
    required: true,
  },

  address_type: {
    type: String,
    required: true,
  },

  street_address: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const CustomerAddress = mongoose.model("CustomerAddress", addressSchema);

export default CustomerAddress;
