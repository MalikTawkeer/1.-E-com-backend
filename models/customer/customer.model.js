import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    min: [8, "password must be of 8 chars"],
  },

  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CustomerAddress",
  },

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CustomerOrder",
    },
  ],

  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cart",
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
