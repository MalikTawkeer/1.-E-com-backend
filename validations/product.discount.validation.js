import * as Yup from "yup";

const discountValidationSchema = Yup.object().shape({
  discount_type: Yup.string().required("Discount name is required"),

  discount_type: Yup.string()
    .oneOf(["units", "percentage"], "Invalid discount type")
    .required("Discount type is required"),

  value: Yup.string()
    .matches(/^\d+$/, "Value must be a number")
    .required("Value is required"),

  valid_until: Yup.string()
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      "Date must be in the format YYYY-MM-DDTHH:MM:SS"
    )
    .required("Valid until date and time is required"),
});

export default discountValidationSchema;
