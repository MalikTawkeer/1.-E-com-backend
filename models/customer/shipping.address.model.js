import mongoose from "mongoose";

const ShippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    emailAddress: {
      type: String,
      required: false, // Optional
    },

    streetAddress: {
      type: String,
      required: true,
    },

    apartmentSuiteUnit: {
      type: String,
      required: false, // Optional
    },

    city: {
      type: String,
      required: true,
    },

    stateProvinceRegion: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    addressType: {
      type: String,
      enum: ["Residential", "Business"],
      required: false, // Optional
    },

    defaultAddress: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ShippingAddress = mongoose.model(
  "Shipping_Address",
  ShippingAddressSchema
);

export default ShippingAddress;
