import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  price: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId, // Refrences to products collection
    ref: "Product",
    required: true,
  },

  order_id: {
    type: mongoose.Schema.Types.ObjectId, // Refrences to orders collection
    ref: "Order",
    required: true,
  },
});
