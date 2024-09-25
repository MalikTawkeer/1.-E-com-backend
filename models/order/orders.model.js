import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    total_amount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "PENDING",
    },

    order_date: {
      type: Date,
      required: true,
    },

    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },

    payment_mode: {
      type: String,
      required: true,
    },

    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shipping_Address",
    },

    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "OrderItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
