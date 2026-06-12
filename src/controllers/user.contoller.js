import asyncHandler from "../utils/asyncHandler.js";
import APIError from "../utils/APIError.js";
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponce from "../utils/APIResponce.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "successfull responce from backned",
  // });


  // 1st step
  const { userName, fullName, email, password } = req.body;
  //console.log("user name: ",email, password);
  if (
    [userName, fullName, email, password].some(
      (feilds) => feilds?.trim() === ""
    )
  ) {
    return new APIError(400, "All fields are required");
  }

  // 2nd step

  const exist = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (exist) {
    throw new APIError(409, "UserName or email already exists");
  }

  // 3rd step
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar is required");
  }

  // 4th step
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new APIError(400, "Avatar is required");
  }

  // 5th step
  const createUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  // 6th step
  const createdUser = await User.findById(createUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new APIError(400, "Something went wrong while registration");
  }

  // 7th step
  return res
    .status(201)
    .json(new ApiResponce(200, createdUser, "User registered successfully"));
});

export default registerUser;
