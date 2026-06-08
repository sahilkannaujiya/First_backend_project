import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //file has successfully uploaded on cloudinary
    console.log("file successfully uploaded on cloudinary", response.url);
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath)//remove file from locally saved file as the upload operation got failed
    return null;
  }
}

export default uploadOnCloudinary;
