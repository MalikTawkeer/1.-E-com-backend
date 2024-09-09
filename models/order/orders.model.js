import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    total_amount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "pending",
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

    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "OrderItem",
      },
    ],

    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "OrderPayment",
    },

    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ShippingAddress",
    },

    billing_address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BillingAddress",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
