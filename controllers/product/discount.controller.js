import DiscountModel from "../../models/product/product.discount.model.js";

import discountValidationSchema from "../../validations/product.discount.validation.js";

// Add discount
const addDiscount = async (req, res) => {
  try {
    // Validate the incoming data against the Yup schema
    await discountValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { discount_name, discount_type, value, valid_until } = req.body;

    // Check duplicate
    const exists = await DiscountModel.findOne({ discount_name });
    if (exists)
      return res.status(400).json({ message: "Discount alredy Exists!" });

    // Store into db
    const discount = await DiscountModel.create({
      discount_name,
      discount_type,
      value,
      valid_until,
    });

    return res.status(200).json({ message: "Discount added Successfully." });
  } catch (error) {
    console.log(error, "Error while adding discount");
    return res
      .status(500)
      .json({ message: "Internal server Error", errors: error });
  }
};

// update discount
const updateDiscount = async (req, res) => {
  try {
    // Validate the incoming data against the Yup schema
    await discountValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { id } = req.params;

    const { discount_name, discount_type, value, valid_until } = req.body;

    // Store into db
    const updatedDiscount = await DiscountModel.findByIdAndUpdate(id, {
      discount_name,
      discount_type,
      value,
      valid_until,
    });
    if (!updatedDiscount)
      return res.status(200).json({ message: " discount not exists" });

    return res.status(200).json({ message: "Discount Updated Successfully." });
  } catch (error) {
    console.log(error, "Error while adding discount");
    return res
      .status(500)
      .json({ message: "Internal server Error", error: error.message });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await DiscountModel.find();

    return res.status(200).json({ discounts });
  } catch (error) {
    console.log(error, "ERROR while getting all discounts");

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await DiscountModel.findByIdAndDelete(id);
    if (!result)
      return res.status(404).json({ message: "Couldnt find discount!!" });

    return res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.log(error, "ERROR while deleting discount");
    return res.status(500).json({ message: "internal server error" });
  }
};

export { addDiscount, updateDiscount, getAllDiscounts, deleteDiscount };
