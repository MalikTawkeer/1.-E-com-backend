import mongoose from "mongoose";

const orderPaymentSchema = new mongoose.Schema(
  {
    payment_method: {
      type: String,
      required: true,
    },

    payment_status: { type: String, required: true, default: "pending" },

    payment_date: { type: Date, required: true },

    amount: { type: String, required: true },

    transaction_id: { type: String },

    gateway_response: { type: String },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
  },

  {
    timestamps: true,
  }
);

const OrderPayment = mongoose.model("OrderPayment", orderPaymentSchema);

export default OrderPayment;
