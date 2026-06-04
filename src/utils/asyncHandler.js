const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      sucess: false,
      messege: error.messege,
    });
  }
};

export default asyncHandler;
//another method to wrap same thing..

/*
const asyncHandler = (func) {
(req, res, next) => {
  Promise.resolve(
  func(req, res, next)
  )
  .catch((error) => next(error))
  }
}
*/
