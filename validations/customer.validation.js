import * as Yup from "yup";

const addressValidationSchema = Yup.object().shape({
  city: Yup.string().required("City is required"),

  state: Yup.string().required("State is required"),

  // customer: Yup.string()
  //   .required("Customer ID is required")
  //   .matches(/^[0-9a-fA-F]{24}$/, "Invalid Customer ID format"), // for ObjectId validation
});

const customerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  address: addressValidationSchema,
});

export default customerValidationSchema;
