import { use } from "react";
import User from "../models/user.models";
import APIError from "../utils/APIError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';


export const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "")
  
    if(!token){
      throw new APIError(401, "Unauthorized request")
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      throw new APIError(401, "Invalid Access Token")
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new APIError(401, "Invalid Access Token")
  }
})