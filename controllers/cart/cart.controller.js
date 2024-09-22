import mongoose, { startSession } from "mongoose";

import ProductModel from "../../models/product/product.model.js";
import CartModel from "../../models/cart/cart.model.js";
import CartItemModel from "../../models/cart/cart.items.model.js";
import CustomerModel from "../../models/customer/customer.model.js";

import addToCartSchema from "../../validations/addToCart.js";

// Add item into a cart
const addToCart = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    // Validate data
    await addToCartSchema.validate(req.body, {
      abortEarly: true,
    });

    session.startTransaction();

    const { product_id, quantity, price } = req.body;

    const customer_id = req?.user?.id;

    //Check customer exists or not
    const customer = await CustomerModel.findById(customer_id).session(session);
    if (!customer) {
      //customer does not exists
      return res.status(404).json("customer does not exists");
    }

    // Check product exists or not
    const product = await ProductModel.findById(product_id);
    if (!product)
      return res.status(404).json({ message: "Product doesn't exist!!" });

    // Check stock limit
    if (quantity > product?.stock)
      return res
        .status(400)
        .json({ message: `Quantity cannot be more than Stock` });

    if (!customer?.cart_id) {
      // Handle new cart
      // Create new cart
      // store cart items
      const cartItem = await CartItemModel({
        price,
        quantity,
        product_id,
      });
      await cartItem.save({ session });

      // link item with cart
      const newCart = await CartModel({
        cart_items: [cartItem._id],
        cust_id: customer_id,
      });
      await newCart.save({ session });

      // link cart with cart item
      // cartItem.cart_id = newCart._id;
      // await cartItem.save({ session });

      // link Cart with customer
      customer.cart_id = newCart._id;
      customer.save({ session });

      await session.commitTransaction();
      session.endSession;

      return res.status(201).json({ message: "Item added into a cart" });
    }

    // Handle already created cart
    // Find cart
    const cart = await CartModel.findOne({ cust_id: customer_id });

    //Add item into cartItems model
    const cartItem = await CartItemModel({
      price,
      quantity,
      product_id,
    });
    await cartItem.save({ session });

    // Link cartItems with Cart
    cart.cust_id = customer_id;
    cart.cart_items.push(cartItem._id);
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession;

    return res
      .status(200)
      .json({ message: "Item added into a cart successfully" });

    // create new cart

    // validate data
    // destructre data
    // check if there is any existing cart if any then use that
    // store cart-items into cartItems collection
    // store cart and link with cartItems collection [using ids]
    // link cartItems with cart using ids
    // get data
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error, "Error while adding item into a cart!");
    res.status(500).json({ error });
  }
};

// Remove item from Cart
const removeItemFromCart = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cart_item_id } = req.params;

    const customer_id = req?.user?.id;

    session.startTransaction();

    // Check cart exists
    const cart = await CartModel.findOne({ cust_id: customer_id }).session(
      session
    );
    if (!cart) return res.status(404).json({ message: "Cart doesn't exist!!" });

    // Check cart item existss
    const cartItem = await CartItemModel.findById(cart_item_id).session(
      session
    );
    if (!cartItem)
      return res.status(404).json({ message: "Cart item doesn't exist!!" });

    // Delete cartItem
    const deletedCartItem = await CartItemModel.findByIdAndDelete(
      cart_item_id
    ).session(session);

    // De-reference from cart
    const updatedCart = await CartModel.findOneAndUpdate(
      { cart_items: { $in: [cart_item_id] } }, // Find the cart containing the cartItemId in the array
      { $pull: { cart_items: cart_item_id } }, // Remove the cartItemId from the cart_items array
      { new: true } // Returns updated document
    ).session(session);

    // Delete cart if there is no item in cart!
    if (updatedCart?.cart_items?.length === 0) {
      // Simply delete Cart
      const result = await CartModel.findByIdAndDelete(
        updatedCart?._id
      ).session(session);

      // Remove cart_id field from the customer document
      await CustomerModel.findByIdAndUpdate(
        customer_id,
        { $unset: { cart_id: "" } } // This removes the cart_id field
      ).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Item removed successfully!" });

    // check cart exists
    // check cartItem by id> exists
    // delete cart item from cartItem-model
    // delete from cart cartItems arrary
    // delete cart if there is no item in cart!!
    // return result
  } catch (error) {
    console.log(error, "Error:: while removing item from cart");

    await session.abortTransaction();
    session.endSession();

    return res
      .status(500)
      .json({ message: "Error:: while removing item from cart", error });
  }
};

// Update cart item Quantity
const updateCartItemQnty = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    // Check if quantity is a number
    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be an integer!" });
    }

    // Check if quantity is a whole number
    if (!Number.isInteger(Number(quantity))) {
      return res
        .status(400)
        .json({ message: "Quantity must be a whole number.!" });
    }

    // Check if quantity is greater than 0
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0 !" });
    }

    session.startTransaction();

    const cartItem = await CartItemModel.findById(cart_item_id).session(
      session
    );
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found!" });

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "quantity updated" });

    // check cart item exists
    // update quantity
    // send reponse
  } catch (error) {
    console.log(error, "Error:: while removing item from cart");
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Error:: while removing item from cart", error });
  }
};

const getCart = async (req, res) => {
  try {
    const customer_id = req?.user?.id;

    const myCart = await CartModel.findOne({ cust_id: customer_id })
      .populate({
        path: "cart_items", // Path to the cart items
        populate: {
          path: "product_id", // Path to the product within the cart items
          select: "name description product_images -_id ",
          model: "Product", // The model name of the product (replace with your actual model name)
        },
      })
      .populate({ path: "cust_id", select: "name email" });

    return res.status(200).json({ message: "my Cart", myCart });
  } catch (error) {
    console.log(error, "Error:: while removing item from cart");

    return res
      .status(500)
      .json({ message: "Error:: while removing item from cart", error });
  }
};

export { addToCart, removeItemFromCart, updateCartItemQnty, getCart };
