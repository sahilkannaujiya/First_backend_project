import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
// console.log("=== CLOUDINARY FILE LOADED ===");

// console.log("CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API_KEY =", process.env.CLOUDINARY_CLOUD_KEY);
// console.log(
//   "API_SECRET =",
//   process.env.CLOUDINARY_CLOUD_SECRET ? "FOUND" : "MISSING"
// );

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has successfully uploaded on cloudinary
    console.log("file successfully uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    //fs.unlinkSync(localFilePath)//remove file from locally saved file as the upload operation got failed
    console.log("Cloudinary Error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;
