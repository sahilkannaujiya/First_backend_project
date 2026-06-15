import asyncHandler from "../utils/asyncHandler.js";
import APIError from "../utils/APIError.js";
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponce from "../utils/APIResponce.js";

const genrateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateFreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIError(
      500,
      "something went wrong while genrating access token and refresh token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  //...req body give data
  //email or userName and password
  //exist in database
  //password verification
  // access token matches or not
  //...send cookies secure
  //res true/false

  // 1st step..
  const { email, userName, password } = req.body;

  if (!email || !userName) {
    throw new APIError(400, "userName or email is required");
  }
  //2nd step..
  const existUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!existUser) {
    throw new APIError(404, "invalid user credentials");
  }
  // 3rd step..
  const ispasswordValid = await existUser.isPasswordCorrect(password);
  if (!ispasswordValid) {
    throw new APIError(401, "invalid password");
  }
  // 4th step..
  const { accessToken, refreshToken } =
    await genrateAccessTokenAndRefreshTokens(existUser._id);

  // 5th step..
  const loggedInUser = await User.findById(existUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        {
          existUser: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const accessUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User logged out Successfully"));
});

export { registerUser, loginUser, logoutUser };
