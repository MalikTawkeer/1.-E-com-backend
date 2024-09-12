import { v2 as cloudinary } from "cloudinary";
import fs, { unlink, unlinkSync } from "fs";

import cloudinaryConfig from "../config/cloudinary.js";
import { log } from "console";

// CONFIGURE CLOUDINARY
cloudinary.config(cloudinaryConfig);

// UPLOAD FILE
const uploadFileOnCloudinary = async (
  localFilePath,
  resourceType = null,
  folderName = null
) => {
  try {
    if (!localFilePath || !folderName || !resourceType) return null;

    // UPLOAD A SINGLE FILE TO CLOUDINARY
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: folderName,
    });

    // // REMOVE FILE FROM SERVER AFTER UPLOAD
    // fs.unlinkSync(localFilePath);

    // RETURN IMG URL BACK
    return response?.url;
  } catch (error) {
    console.log(error, "cloud err");
    // fs.unlinkSync(localFilePath);
    return null;
  }
};

// DELETE FILES BY URL
const deleteFromCloudinaryByUrl = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract the part of the URL after '.../image/upload/'
    const parts = imageUrl.split("/image/upload/");
    const pathWithVersion = parts[1];

    // Remove the version number and file extension
    const path = pathWithVersion.substring(pathWithVersion.indexOf("/") + 1);
    const publicId = path.split(".")[0].replace(/%20/g, " "); // Replace URL-encoded spaces with actual spaces

    // DELETE FILE FROM CLOUDINARY
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    // RETURN RESPONSE BACK
    return response.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { uploadFileOnCloudinary, deleteFromCloudinaryByUrl };
