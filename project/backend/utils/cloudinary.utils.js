import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Apply config here — at function call time, env vars are guaranteed to be loaded
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    configureCloudinary();
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    configureCloudinary();
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};