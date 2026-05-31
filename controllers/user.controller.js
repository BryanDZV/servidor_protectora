const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const userData = req.body.user || req.body;
  const createdUser = await userService.registerUser(userData);
  return res.status(201).json(createdUser);
});

const login = catchAsync(async (req, res) => {
  const data = req.body.user || req.body;
  const result = await userService.loginUser(data.email, data.password);
  return res.status(200).json(result);
});

const checkSession = (req, res) => {
  return res.status(200).json(req.user);
};

const getUserById = catchAsync(async (req, res) => {
  const myUser = await userService.getUserById(req.params.id);
  return res.status(200).json(myUser);
});

const postFav = catchAsync(async (req, res) => {
  const updatedUser = await userService.updatePopulatedUser(
    req.body._id,
    req.body,
  );
  return res.status(200).json(updatedUser);
});

const postAdoption = catchAsync(async (req, res) => {
  const updatedUser = await userService.updatePopulatedUser(
    req.body._id,
    req.body,
  );
  return res.status(200).json(updatedUser);
});

module.exports = {
  register,
  login,
  checkSession,
  postFav,
  postAdoption,
  getUserById,
};
