import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import config from "../../config/config.js";

import CustomerModel from "../../models/customer/customer.model.js";
import CustomerAddressModel from "../../models/customer/customer.address.model.js";

import customerRegisterValidationSchema from "../../validations/customer.validation.js";
import customerLoginValidationSchema from "../../validations/customer.login.validations.js";

// JWT Token age
const JWT_MAX_AGE = "1d";

const createToken = (user) => {
  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_secret_key,
    {
      expiresIn: JWT_MAX_AGE,
    }
  );

  return token;
};

// Register customer
const register = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Input Validation
    await customerRegisterValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { name, email, password, address } = req.body;

    const user = await CustomerModel.register(name, email, password, session);

    // Store and associate customer to address
    const newAddress = await CustomerAddressModel({
      city: address?.city,
      state: address?.state,
      customer: user?._id, // Link customer with Address
    });
    await newAddress.save({ session });

    // Associate address with customer
    user.address = newAddress._id;
    await user.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      message: "Customer registered!",
      user: {
        name: user.name,
        email: user.email,
        address: newAddress,
      },
    });
  } catch (error) {
    console.log(error, "Error while registering user");
    await session.abortTransaction();
    await session.endSession();
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

// Login Customer
const login = async (req, res) => {
  try {
    // Validate login info
    await customerLoginValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { email, password } = req.body;

    const user = await CustomerModel.login(email, password);

    const token = createToken(user);

    // Send the token as a cookie
    res.cookie("jwt_tkn", token, {
      httpOnly: true, // Accessible only by the web server, not JavaScript on the client-side
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Token expiration: 1 day
    });

    // Send a success message or user info (without password)
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role, token },
    });
  } catch (error) {
    console.log(error, "Error while logging in customer");
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

// View profile info by cust id
const viewProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if authenticated user id and params id matches
    if (id !== req?.user?.id)
      return res.status(404).json("User not permitted!");

    const info = await CustomerModel.findById(id)
      .select("-password -orders -_id")
      .populate({
        path: "address",
        select: "-_id -customer",
      })
      .populate({
        path: "shipping_addresses",
        model: "Shipping_Address",
      });
    if (!info) return res.status(400).json("User doent exist!");

    return res.status(200).json(info);
  } catch (error) {
    console.log(error, "ERROR while viewing profile info.");
    return res.status(500).json(error);
  }
};

// Update Profile by cust id
const updateProfile = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await customerLoginValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { name, email, password, address } = req.body;
    const { id } = req.params;

    // Check if authenticated user id and params id matches
    if (id !== req?.user?.id)
      return res.status(404).json("User not permitted!");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await CustomerModel.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    }).session(session);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const newAddress = await CustomerAddressModel.findByIdAndUpdate(
      user?.address,
      {
        city: address?.city,
        state: address?.state,
        customer: user?._id, //link cust_id with address
      }
    );
    await newAddress.save({ session });

    // link address with customer
    user.address = newAddress._id;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Customer updated successfully." });
  } catch (error) {
    console.log(error, "Error while updaing cust profile");
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(error);
  }
};

export { register, login, viewProfile, updateProfile };
