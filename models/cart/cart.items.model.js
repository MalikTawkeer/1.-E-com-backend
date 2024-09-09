import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
