import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  totalAmount: {
    type: String,
    required: true,
  },

  cart_items: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "CartItem" },
  ],

  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
