const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { generateSign } = require("../jwt/jwt");
const { setAuthCookie, clearAuthCookie } = require("../utils/authCookie");

const register = catchAsync(async (req, res) => {
  const userData = req.body.user || req.body;
  const createdUser = await userService.registerUser(userData);

  const token = generateSign(String(createdUser._id), createdUser.email);
  setAuthCookie(res, token);

  return res.status(201).json({ user: createdUser });
});

const login = catchAsync(async (req, res) => {
  const data = req.body.user || req.body;
  const { user, token } = await userService.loginUser(data.email, data.password);

  setAuthCookie(res, token);

  return res.status(200).json({ user });
});

const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Sesión cerrada correctamente" });
};

const checkSession = (req, res) => {
  return res.status(200).json(req.user);
};

const getUserById = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const isOwner = String(req.user._id) === String(req.params.id);

  // Un usuario solo puede ver su propio perfil; el admin, cualquiera.
  if (!isAdmin && !isOwner) {
    throw new AppError("No tienes permiso para ver este perfil", 403);
  }

  const user = await userService.getUserById(req.params.id);
  return res.status(200).json(user);
});

const postFav = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user._id, req.body);
  return res.status(200).json(updatedUser);
});

const postAdoption = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user._id, req.body);
  return res.status(200).json(updatedUser);
});

module.exports = {
  register,
  login,
  logout,
  checkSession,
  getUserById,
  postFav,
  postAdoption,
};
