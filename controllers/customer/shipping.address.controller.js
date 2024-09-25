import mongoose from "mongoose";

import ShippingAddressModel from "../../models/customer/shipping.address.model.js";
import CustomerModel from "../../models/customer/customer.model.js";

import shippingAddressValidationSchema from "../../validations/shipping.address.validation.js";

// Add shipping address
const addShippingAddress = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await shippingAddressValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    // Destructure the shipping address fields from the request body
    const {
      fullName,
      phoneNumber,
      emailAddress,
      streetAddress,
      apartmentSuiteUnit,
      city,
      stateProvinceRegion,
      postalCode,
      country,
      addressType,
      defaultAddress,
    } = req.body;

    session.startTransaction();

    const customer = await CustomerModel.findById(req?.user?.id).session(
      session
    );
    if (!customer) return res.status(400).json("Not permitted, Access denied");

    // store into DB
    const newShippingAddress = await ShippingAddressModel.create(
      [
        {
          fullName,
          phoneNumber,
          emailAddress,
          streetAddress,
          apartmentSuiteUnit,
          city,
          stateProvinceRegion,
          postalCode,
          country,
          addressType,
          defaultAddress,
        },
      ],
      { session }
    );

    // Link shipping address with Customer
    customer.shipping_addresses.push(newShippingAddress[0]?._id);
    await customer.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Shipping address Added Successfully",
      newShippingAddress,
    });
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(error);
  }
};

// List shipping addresses
const getShippingAddresses = async (req, res) => {
  try {
    const customer_id = req?.user?.id;

    const shippingAddresses = await CustomerModel.findById(customer_id)
      .populate({
        path: "shipping_addresses",
      })
      .select("_id");

    return res.status(200).json(shippingAddresses);
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    return res.status(500).json(error);
  }
};

// Update shipping addresses
const updateShippingAddress = async (req, res) => {
  try {
    // Validata  input data
    await shippingAddressValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { id } = req.params;

    // Destructure the shipping address fields from the request body
    const {
      fullName,
      phoneNumber,
      emailAddress,
      streetAddress,
      apartmentSuiteUnit,
      city,
      stateProvinceRegion,
      postalCode,
      country,
      addressType,
      defaultAddress,
    } = req.body;

    const shippingAddress = await ShippingAddressModel.findByIdAndUpdate(id, {
      fullName,
      phoneNumber,
      emailAddress,
      streetAddress,
      apartmentSuiteUnit,
      city,
      stateProvinceRegion,
      postalCode,
      country,
      addressType,
      defaultAddress,
    });
    if (!shippingAddress)
      return res.status(404).json("Shipping address not found!!");

    return res.status(200).json("Shipping address Updated successfully");
  } catch (error) {
    console.log(error, "Error while adding shipping address");
    return res.status(500).json(error);
  }
};

// Delete shipping Addresses
const deleteShippingAddress = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    session.startTransaction();

    const deletedShippingAddress = await ShippingAddressModel.findByIdAndDelete(
      id
    ).session(session);
    if (!deletedShippingAddress)
      return res.status(404).json("Shipping address not found!!");

    // Step 2: Remove the reference from the Customer model
    const l = await CustomerModel.updateMany(
      { shipping_addresses: id }, // Find customers with this address ID in the array
      { $pull: { shipping_addresses: id } }, // Remove the specific ID from the array
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json("Shipping address Deleted successfully.");
  } catch (error) {
    console.log(error, "Error while adding shipping address");

    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(error);
  }
};

export {
  addShippingAddress,
  getShippingAddresses,
  updateShippingAddress,
  deleteShippingAddress,
};
