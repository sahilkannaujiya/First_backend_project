import asyncHandler from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "successfull responce from backned"
  })
})

export default registerUser;