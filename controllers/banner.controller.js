import mongoose from "mongoose";
import BannerModel from "../models/banner.model.js";

import {
  deleteFromCloudinaryByUrl,
  uploadFileOnCloudinary,
} from "../services/cloudinary.services.js";
import deleteTempFile from "../utils/delete.temp.image.file.js";

// Add banner
const addBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(404).json("Banner image is required!");

    const { caption } = req.body;
    let url = "";

    // Upload banner image to cloud
    if (req.file && req.file.path) {
      const bannerImgUrl = await uploadFileOnCloudinary(
        [req.file],
        "image",
        "banner_images"
      );

      url = bannerImgUrl;

      // Delete a temp file
      await deleteTempFile([req?.file]);
    }

    // Store banner into DB
    const newBanner = await BannerModel.create({
      url,
      caption: caption ? caption : "",
    });

    return res
      .status(201)
      .json({ message: "Banner added successfully.", newBanner });

    // validate data
    // upload banner to cloud
    // del local banner image
    // store banner into DB
  } catch (error) {
    console.log(error, "Error while adding banner!");
    // Delete a temp file
    await deleteTempFile([req?.file]);
    res.status(500).json(error);
  }
};

// Get banners
const getBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find({});

    return res
      .status(200)
      .json({ message: "Banners retrived successfully.", banners });
  } catch (error) {
    console.log(error, "Error while getting all banners");
    res.status(500).json(error);
  }
};

const updateBanner = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { banner_id } = req.params;
    const { caption } = req.body;
    let url = "";
    let oldBannerImg = "";

    session.startTransaction();

    const banner = await BannerModel.findById(banner_id).session(session);
    if (!banner) return res.status(200).json({ message: "Banner not found" });

    // Check for new banner image
    if (req.file && req.file.path) {
      url = await uploadFileOnCloudinary([req.file], "image", "banner_images");
      deleteTempFile([req.file]);
    }

    oldBannerImg = banner.url;
    // If new banner img and caption update
    banner.url = req.file ? url : banner.url;
    banner.caption = caption ? caption : banner.caption;
    await banner.save({ session });

    // Delete old banner from cloud
    if (req.file && req.file.path)
      await deleteFromCloudinaryByUrl(oldBannerImg);

    await session.commitTransaction();
    await session.endSession();

    return res.status(200).json({ message: "banner updated" });

    // check banner exists
    // check for any banner image
    // upload new banner img
    // update DB
    // delete old banner img
  } catch (error) {
    console.log(error, "Error while updating banner");
    deleteTempFile([req.file]);
    res.status(500).json(error);
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { banner_id } = req.params;

    const banner = await BannerModel.findById(banner_id);

    // Delete from db
    const result = await BannerModel.findByIdAndDelete(banner_id);
    if (!result) return res.status(404).json("Banner not found!");

    // Delete banner img from cloudinary
    await deleteFromCloudinaryByUrl(banner.url);

    return res.status(200).json("Banner deleted Successfully.");
  } catch (error) {
    console.log(error, "Error while deleting banner");
    res.status(500).json(error);
  }
};

export { addBanner, getBanners, updateBanner, deleteBanner };
