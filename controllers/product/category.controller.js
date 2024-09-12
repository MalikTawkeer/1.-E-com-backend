import ProductCategory from "../../models/product/product.category.model.js";
import categoryValidationSchema from "../../validations/product.category.validation.js";

import deleteTempFile from "../../utils/delete.temp.image.file.js";
import {
  uploadFileOnCloudinary,
  deleteFromCloudinaryByUrl,
} from "../../services/cloudinary.services.js";

// Add Product Category
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body || [];
    let category_icon = "";

    // Validate the incoming data against the Yup schema
    await categoryValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    // Check category icon
    if (!req.file)
      return res.status(400).json({ message: "Category icon is required!" });

    // Check category alredy exits or not
    const catExists = await ProductCategory.findOne({ name });
    if (catExists) {
      // Delete temp img file from server
      await deleteTempFile([req.file]);
      return res.status(409).json({ message: "Category alredy exists!" });
    }

    // Upload category icon to Cloudinary
    if (req.file && req.file.path) {
      category_icon = await uploadFileOnCloudinary(
        req.file.path, // uploading image path
        "image", // file type
        "product_category_images" // folder name
      );

      // Delete temp img file from server
      await deleteTempFile([req.file]);

      if (!category_icon)
        return res
          .status(503)
          .json({ message: "Bad happned while uploading category icon!" });
    }

    // Store  category into DB
    const result = await ProductCategory.create({
      name: name,
      description: description,
      category_icon: category_icon,
    });
    if (!result)
      return res
        .status(400)
        .json({ message: "Bad happned, while saving category" });

    return res.status(200).json({ message: "Category created successfully!" });

    // start session*
    // get data*
    // validate checking*
    // check for category icon
    // check category alredy exists if yes send err*

    // add category
    //- get category icon url
    //- upload to cloudinary
    //- finally save category data into DB
  } catch (error) {
    console.log(error);

    // Delete temp img file from server
    await deleteTempFile([req.file]);

    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

// Get all product categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().select("-products");

    return res.status(200).json({
      categories: categories,
      message: "All product categories retrived successfully!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

// Delete Category by id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    // Check if it exists
    const exists = await ProductCategory.findById(id);
    if (!exists)
      return res.status(404).json({ message: "Category does't exist" });

    // Delete from cloudinary
    const result = await deleteFromCloudinaryByUrl(exists.category_icon);
    if (!result) {
      return res
        .status(400)
        .json({ message: "Bad happned while delting category icon!" });
    }

    // Delete from DB
    const result2 = await ProductCategory.findByIdAndDelete(id);
    if (!result2) {
      return res
        .status(400)
        .json({ message: "Bad happned while delting product category!" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });

    // get category id
    // check if it exists
    // then delete coludinary icon
    // then delete DB records
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

// Edit category info
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const { name, description } = req.body || [];
    console.log(name, description);

    let category_icon = "";

    // Validate the incoming data against the Yup schema
    await categoryValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    // Check category exist or not
    const exists = await ProductCategory.findById(id);
    if (!exists)
      return res.status(404).json({ message: "Category does't exist" });

    // Upload category icon to Cloudinary
    if (req.file && req.file.path) {
      category_icon = await uploadFileOnCloudinary(
        req.file.path, // uploading image path
        "image", // file type
        "product_category_images" // folder name
      );

      // Delete temp img file from server
      await deleteTempFile([req.file]);

      if (!category_icon)
        return res
          .status(503)
          .json({ message: "Bad happned while uploading category icon!" });
    }

    // Store into DB
    const result = await ProductCategory.findByIdAndUpdate(id, {
      name: name,
      description: description,
      category_icon: req.file.path ? category_icon : exists?.category_icon,
    });
    if (!result) {
      // Delete Uploaded icon from cloudinary
      if (req.file && req.file.path)
        await deleteFromCloudinaryByUrl(category_icon);

      return res
        .status(400)
        .json({ message: "Bad happned while Updating category" });
    }

    // Delete Uploaded icon from cloudinary
    if (req.file && req.file.path)
      await deleteFromCloudinaryByUrl(exists.category_icon);

    // Category  updated Successfully
    return res.status(200).json({ message: "Category updated successfully" });

    // get data
    // validate data
    // check cat exists
    // check icon then upload
    // store into db
    // delete prev icon
  } catch (error) {
    console.log(error);

    // Delete temp img file from server
    await deleteTempFile([req.file]);

    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

export { addCategory, getAllCategories, deleteCategory, editCategory };
