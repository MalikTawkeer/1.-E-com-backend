import mongoose, { model } from "mongoose";

import CustomerModel from "../../models/customer/customer.model.js";
import CartModel from "../../models/cart/cart.model.js";
import CartItemModel from "../../models/cart/cart.items.model.js";
import OrderModel from "../../models/order/orders.model.js";
import OrderItemModel from "../../models/order/order.items.model.js";
import ShippingAddressModel from "../../models/customer/shipping.address.model.js";
import ProductModel from "../../models/product/product.model.js";
import { populate } from "dotenv";

// Place order
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const customer_id = req?.user?.id;

    const { shipping_address_id, payment_mode } = req.body;

    session.startTransaction();

    // Check customer
    const customer = await CustomerModel.findById(customer_id).session(session);
    if (!customer) return res.status(400).json("User not found!");

    // Check shipping Address
    const shippingAddress = await ShippingAddressModel.findById(
      shipping_address_id
    ).session(session);
    if (!shippingAddress)
      return res.status(400).json("Shipping address not found!");

    // Retrive cart by cart id
    const myCart = await CartModel.findById(customer?.cart_id)
      .populate("cart_items")
      .session(session);
    if (!myCart) return res.status(400).json("Cart not found!");

    // Calculate total amount
    const totalPrice = myCart.cart_items.reduce((total, item) => {
      return total + item.quantity * parseFloat(item.price);
    }, 0);

    // Create Order first
    const myOrder = await OrderModel({
      total_amount: totalPrice,
      order_date: new Date(),
      cust_id: customer_id,
      payment_mode,
      order_items: [], // Fill with order item ids arrary
      shipping_address: shipping_address_id,
    });
    await myOrder.save({ session });

    // Loop through each item in the cart and create corresponding OrderItems
    const orderItemPromises = myCart.cart_items.map(async (cartItem) => {
      const orderItem = new OrderItemModel({
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_id: cartItem.product_id,
        order_id: myOrder._id,
      });
      await orderItem.save({ session }); // Save the order item

      // Decrement the stock from product
      const product = await ProductModel.findById(cartItem.product_id).session(
        session
      );
      if (!product) return res.status(404).json("Prodcut not found!");

      // Update product stock
      product.stock = product.stock - cartItem.quantity;
      await product.save({ session });

      return orderItem._id; // Return the order item ID
    });

    // Resolve all promises to get the array of order item IDs
    const orderItemIds = await Promise.all(orderItemPromises);

    // Update the order with list of order IDs
    myOrder.order_items = orderItemIds;
    await myOrder.save({ session });

    // Delete all cart items from CartItem collection based on IDs
    await CartItemModel.deleteMany(
      { _id: { $in: myCart?.cart_items } },
      { session }
    );

    // Delete cart from cart collection
    await CartModel.deleteOne({ _id: myCart._id }, { session });

    // Find and update the customer to remove the cart_id
    await CustomerModel.findOneAndUpdate(
      { _id: customer_id },
      { $unset: { cart_id: 1 } }, // This removes the cart_id field from the customer
      { new: true }
    ).session(session);

    // Store order id into customer orders arrary ,for efficient access
    customer.orders.push(myOrder._id);
    await customer.save({ session });

    // Commmit changes
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: "Order placed successfully", order: myOrder });
  } catch (error) {
    console.log(error, "Error while placing order");

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json(error);
  }
};

// get Order history
const getOrderHistory = async (req, res) => {
  try {
    const customer_id = req?.user?.id;

    const customer = await CustomerModel.findById(customer_id)
      .populate({
        path: "orders",
        populate: {
          path: "order_items",
          populate: {
            path: "product_id", // Assuming 'productId' is the field in order items referencing the product
            model: "Product", // Replace 'Product' with the actual name of your product model
            select: "name description product_images",
            populate: {
              path: "product_images",
              model: "ProductImage",
              select: "url",
            },
          },
        },
      })
      .populate({
        path: "orders",
        populate: {
          path: "shipping_address",
          model: "Shipping_Address",
          select: "-createdAt",
        },
      });

    if (!customer) return res.status(404).json("Customer not found!!");

    return res.status(200).json({
      message: "Orders retrived successfully.",
      myOrders: customer?.orders,
    });
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    return res.status(500).json(error);
  }
};

// View single order detils by order id
const viewOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const orderInfo = await OrderModel.findById(order_id)
      .populate({
        path: "order_items",
        populate: {
          path: "product_id",
          model: "Product", // Replace with your actual product model
          select: "name price description product_images",
          populate: {
            path: "product_images", // Assuming product_images is a field in the Product model referencing the ProductImages collection
            model: "ProductImage", // Replace with the actual name of your product images model
            select: "url", // Select the fields you need from the ProductImages
          },
        },
      })
      .populate({
        path: "shipping_address", // Assuming this field exists in the Order model
        model: "Shipping_Address", // Replace with your actual shipping address model
        select: "-createdAt",
      })
      .populate({
        path: "cust_id",
        model: "Customer",
        select: "name email phone_number",
      });
    if (!orderInfo) return res.status(404).json("Order not Found!");

    return res.status(200).json({ order_details: orderInfo });
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    return res.status(500).json(error);
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const cancelledOrder = await OrderModel.findByIdAndUpdate(order_id, {
      status: "CANCELLED",
    });
    if (!cancelledOrder) return res.status(404).json("Order not found!");

    return res.status(200).json("Order Cancelled successfully!");
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    return res.status(500).json(error);
  }
};

export { placeOrder, getOrderHistory, viewOrder, cancelOrder };
