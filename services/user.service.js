const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateSign } = require("../jwt/jwt");

const sanitizeUser = (userDocument) => {
  if (!userDocument) {
    return null;
  }

  const userObject = userDocument.toObject
    ? userDocument.toObject()
    : userDocument;
  delete userObject.password;
  return userObject;
};

const registerUser = async (userData) => {
  const passwordHash = await bcrypt.hash(userData.password, 10);
  const createdUser = await User.create({
    ...userData,
    password: passwordHash,
  });

  return sanitizeUser(createdUser);
};

const loginUser = async (email, password) => {
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  const user = sanitizeUser(foundUser);
  const token = generateSign(String(foundUser._id), foundUser.email);

  return { user, token };
};

const getUserById = async (id) => {
  const user = await User.findById(id).populate(
    "pets favPets inProcessPets info",
  );
  return sanitizeUser(user);
};

const updatePopulatedUser = async (id, payload) => {
  const { _id, password, ...cleanPayload } = payload || {};

  const updatedUser = await User.findByIdAndUpdate(id, cleanPayload, {
    new: true,
    runValidators: true,
  }).populate("pets favPets inProcessPets info");

  return sanitizeUser(updatedUser);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updatePopulatedUser,
};
