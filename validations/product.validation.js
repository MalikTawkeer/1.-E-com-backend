import * as Yup from "yup";

const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters long"),

  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),

  stock: Yup.number()
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  category_id: Yup.string()
    .required("Category is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"), // Matches MongoDB ObjectID format

  admin_id: Yup.string()
    .required("Admin ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Admin ID"), // Matches MongoDB ObjectID format
});

export default productValidationSchema;
