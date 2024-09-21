import mongoose from "mongoose";

import Product from "../../models/product/product.model.js";
import ProductImage from "../../models/product/product.image.model.js";
import Admin from "../../models/admin.model.js";
import Category from "../../models/product/product.category.model.js";

import productValidationSchema from "../../validations/product.validation.js";
import deleteTempFile from "../../utils/delete.temp.image.file.js";

import {
  uploadFileOnCloudinary,
  deleteFromCloudinaryByUrl,
} from "../../services/cloudinary.services.js";

// Add product into DB
const addProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    // Validate the incoming data
    await productValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    // Validate product image || images
    if ((!req?.file && req?.file?.path) || req.files.length === 0)
      return res
        .status(400)
        .json({ message: "Product must have an image or images!" });

    // ** LATER EXTRACT ADMIN FROM Request
    const { name, price, description, stock, category_id, admin_id } = req.body;
    const product_images = [];

    // Start session
    session.startTransaction();

    // Check admin exists
    const admin = await Admin.findById({ _id: admin_id }).session(session);
    if (!admin) return res.status(400).json({ message: "Admin not found!" });

    // Check category exists
    const category = await Category.findById(category_id).session(session);
    if (!category)
      return res.status(400).json({ message: "Category not found!" });

    // If product has single image
    if (req?.files[0]?.path && req?.files?.length === 1) {
      const url = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_images"
      );

      // Delete a temp file
      await deleteTempFile([req?.files[0]]);

      // Error uploading image to cloudinary
      if (!url)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      product_images.push(url);
    }

    // If product has multiple Images
    if (req.files && req.files.length > 1) {
      const urls = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_images"
      );

      // Delete temp files
      await deleteTempFile(req.files);

      // Error in uploadin images to cloudinary
      if (!urls || urls?.length === 0)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      product_images.push(...urls);
    }

    // Associate admin with a Product and store into DB
    const product = await Product({
      name,
      price,
      description,
      stock,
      category_id,
      admin: admin_id,
    });
    // save the product using session
    await product.save({ session });

    // Store product images into DB and link to product
    const imageIds = await ProductImage.saveProductImages(
      product_images,
      session,
      product._id
    );

    // Link images with product
    product.product_images.push(...imageIds);
    await product.save({ session });

    // Push the product id to Admin's products arrary
    admin.products.push(product._id);
    await admin.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send success response
    return res
      .status(200)
      .json({ message: "Product stored successfully", product });
  } catch (error) {
    console.log(error, "ERROR: while adding product");

    // delete single file
    if (req.file && req.file.path) await deleteTempFile([req.file]);
    // Delete multiple files
    if (req.files && req.files.length > 1) await deleteTempFile(req.files);

    return res
      .status(500)
      .json({ message: "Internal server Error", errors: error });
  }
};

// List products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "product_images",
        select: "url -_id", // Select specific fields if needed
      })
      .populate({
        path: "category_id",
        select: "name -_id",
      })
      .populate({
        path: "admin",
        select: "email -_id", //send email only and dont send ids in repsonse
      })
      .exec();

    return res
      .status(200)
      .json({ message: "Products retrived successfully", products });
  } catch (error) {
    console.log(error, "ERROR:: while listing all products");
    return res.status(500).json({ message: "Internal server Error!!" });
  }
};

// Get produt by product id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productInfo = await Product.findById(id)
      .populate({
        path: "product_images",
        select: "url -_id", // Select specific fields if needed
      })
      .populate({
        path: "category_id",
        select: "name -_id",
      })
      .populate({
        path: "admin",
        select: "email -_id", //send email only and dont send ids in repsonse
      })
      .exec();

    if (!productInfo)
      return res.status(404).json({ message: "Product not found!!" });

    return res
      .status(200)
      .json({ message: "Successfully retrived product info.", productInfo });

    // validate and check id
    // get info
    // send back
  } catch (error) {
    console.log("ERROR:: while getting product details by id", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;

    // Check procut exists or not
    const exists = await Product.findById(id).populate({
      path: "product_images",
      select: "url -_id",
    });
    if (!exists)
      return res.status(404).json({ message: "Product does'nt exist!" });

    session.startTransaction();

    // Delete from db
    const result = await Product.findByIdAndDelete(id).session(session);
    if (!result)
      return res.status(404).json({ message: "Product not found!!" });

    //Delete images from clodinary
    const result2 = await deleteFromCloudinaryByUrl(exists?.product_images);
    if (!result2)
      return res
        .status(400)
        .json({ message: "Bad happned while deleting product images!" });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Product Deleted Successfully." });
    // get id
    // check exists or not
    // delete images from cloudinary
    // delete from db
  } catch (error) {
    console.log("ERROR:: while deleting product", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    // Validate the incoming data
    await productValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    // ** LATER EXTRACT ADMIN FROM Request
    const { name, price, description, stock, category_id, admin_id } = req.body;
    const product_images = [];

    session.startTransaction();

    //Check product exists or not
    const exists = await Product.findById(id)
      .populate({
        path: "product_images",
        select: "url -_id",
      })
      .session(session);
    if (!exists) return res.status(404).json({ message: "Product not found!" });

    // Check admin exists
    const admin = await Admin.findById({ _id: admin_id }).session(session);
    if (!admin) return res.status(400).json({ message: "Admin not found!" });

    // Check category exists
    const category = await Category.findById(category_id).session(session);
    if (!category)
      return res.status(400).json({ message: "Category not found!" });

    // Upload new images to cloudinary if any
    // If product has single image
    if (req?.files[0]?.path && req?.files?.length === 1) {
      const url = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_images"
      );

      // Delete a temp file
      await deleteTempFile([req?.files[0]]);

      // Error uploading image to cloudinary
      if (!url)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      product_images.push(url);
    }

    // If product has multiple Images
    if (req.files && req.files.length > 1) {
      const urls = await uploadFileOnCloudinary(
        req.files,
        "image",
        "product_images"
      );

      // Delete temp files
      await deleteTempFile(req.files);

      // Error in uploadin images to cloudinary
      if (!urls || urls?.length === 0)
        return res
          .status(400)
          .json({ message: "Bad happned while uploading images to cloud!!" });

      product_images.push(...urls);
    }

    // Update DB
    const product = await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      stock,
      category_id,
      admin: admin_id,
    }).session(session);
    // product.save({ session });

    // Delete old linked images from DB
    if (req?.files[0] && req?.files[0]?.path) {
      const imgIds = product.product_images.map((image) => image._id);
      // Delete old images from ProductImage model
      await ProductImage.deleteMany({ _id: { $in: imgIds } }).session(session);
      // Clear product_images arrary
      product.product_images = [];
    }

    // Link new images with product & store new images to DB
    if (req?.files[0] && req?.files[0]?.path) {
      const imageIds = await ProductImage.saveProductImages(
        product_images,
        session,
        exists._id
      );
      // Link images with new product
      product.product_images.push(...imageIds);
      await product.save({ session });
    }

    // Delete old images from cloudinary
    if (req?.files[0] && req?.files[0]?.path) {
      const result = await deleteFromCloudinaryByUrl(exists?.product_images);
      if (!result)
        return res
          .status(400)
          .json({ message: "ERROR while deleting product old images" });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Product updated successfullly." });

    // validate data
    // check product exists
    // check category and admin ids
    // upload new images if any
    // update DB
    // associate product to new images
    // associate new images to product
    // delete old images
  } catch (error) {
    console.log(error, "ERROR: while adding product");

    // delete single file
    if (req.file && req.file.path) await deleteTempFile([req.file]);
    // Delete multiple files
    if (req.files && req.files.length > 1) await deleteTempFile(req.files);

    return res
      .status(500)
      .json({ message: "Internal server Error", errors: error });
  }
};

export {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
