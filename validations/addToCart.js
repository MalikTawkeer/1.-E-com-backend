import * as Yup from "yup";

// Yup validation schema for add to cart
const addToCartSchema = Yup.object().shape({
  product_id: Yup.string()
    .required("Product ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),

  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),

  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .test(
      "is-decimal",
      "Price can have up to two decimal places",
      (value) => (value * 100) % 1 === 0
    ),
});

export default addToCartSchema;
