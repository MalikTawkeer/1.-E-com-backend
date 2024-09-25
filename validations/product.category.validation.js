import * as Yup from "yup";

const productCategoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required.")
    .min(3, "Category name should be at least 3 characters.")
    .max(50, "Category name should not exceed 50 characters."),

  description: Yup.string()
    .required("Description is required.")
    .min(10, "Description should be at least 10 characters.")
    .max(500, "Description should not exceed 500 characters."),
});

export default productCategoryValidationSchema;
