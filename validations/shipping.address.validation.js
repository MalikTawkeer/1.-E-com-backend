import * as Yup from "yup";

const shippingAddressValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters long"),

  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"),

  emailAddress: Yup.string().email("Invalid email address").optional(),

  streetAddress: Yup.string()
    .required("Street address is required")
    .min(5, "Street address must be at least 5 characters long"),

  apartmentSuiteUnit: Yup.string().optional(),

  city: Yup.string().required("City is required"),

  stateProvinceRegion: Yup.string().required(
    "State/Province/Region is required"
  ),

  postalCode: Yup.string()
    .required("Postal code is required")
    .matches(/^[0-9]{5,10}$/, "Postal code must be between 5 and 10 digits"),

  country: Yup.string().required("Country is required"),

  addressType: Yup.string()
    .oneOf(["Residential", "Business"], "Invalid address type")
    .optional(),

  defaultAddress: Yup.boolean().optional(),
});

export default shippingAddressValidationSchema;
