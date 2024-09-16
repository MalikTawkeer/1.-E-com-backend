import { v2 as cloudinary } from "cloudinary";
import fs, { unlink, unlinkSync } from "fs";

import cloudinaryConfig from "../config/cloudinary.js";
import { log } from "console";

// CONFIGURE CLOUDINARY
cloudinary.config(cloudinaryConfig);

// DELETE FILES BY URL (Handles both single URL and array of URLs)
const deleteFromCloudinaryByUrl = async (imageUrlOrArray) => {
  try {
    if (!imageUrlOrArray) return null;

    // Check if the input is an array or a single URL
    const urls = Array.isArray(imageUrlOrArray)
      ? imageUrlOrArray
      : [imageUrlOrArray];

    // Iterate over the URLs and delete each image
    const deletePromises = urls.map(async (imageUrl) => {
      // Extract the part of the URL after '.../image/upload/'
      const parts = imageUrl["url"].split("/image/upload/");
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
    });

    // Execute all delete promises concurrently
    const results = await Promise.all(deletePromises);
    return results; // Return array of results if it's an array, or a single result if it was a single URL
  } catch (error) {
    console.log(error);
    return null;
  }
};

// UPLOAD FILE
const uploadFileOnCloudinary = async (
  localFilePath,
  resourceType = null,
  folderName = null
) => {
  try {
    if (!localFilePath || !folderName || !resourceType) return null;

    // UPLOAD A SINGLE FILE TO CLOUDINARY
    if (localFilePath[0].path && localFilePath?.length === 1) {
      const response = await cloudinary.uploader.upload(localFilePath[0].path, {
        resource_type: resourceType,
        folder: folderName,
      });
      // RETURN IMG URL BACK
      return response?.url;
    }

    // UPLOAD MULTIPLE FILE TO CLOUDINARY
    if (localFilePath && localFilePath?.length > 1) {
      const uploadUrls = [];

      await Promise.all(
        localFilePath.map(async (file) => {
          const { url } = await cloudinary.uploader.upload(file.path, {
            resource_type: resourceType,
            folder: folderName,
          });

          if (url) {
            uploadUrls.push(url);
          } else if (uploadUrls.length > 0) {
            // Delete uploaded URLs if any file fails
            await Promise.all(
              uploadUrls.map(
                async (url) => await deleteFromCloudinaryByUrl(url)
              )
            );
            // Clear the uploaded URLs array
            uploadUrls = [];
            throw new Error(
              "Upload failed. All uploaded files have been deleted."
            );
          }
        })
      );

      return uploadUrls;
    }

    // // REMOVE FILE FROM SERVER AFTER UPLOAD
    // fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log(error, "cloud err");
    // fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadFileOnCloudinary, deleteFromCloudinaryByUrl };
