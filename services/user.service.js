const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateSign } = require("../jwt/jwt");
const AppError = require("../utils/AppError");
const {
  validationEmail,
  validationPassword,
} = require("../validators/validation");

// Campos que un usuario puede actualizar sobre sí mismo (evita mass assignment).
// `pets` e `info` los gestiona el servidor.
const UPDATABLE_FIELDS = ["name", "image", "favPets", "inProcessPets"];

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
  if (!validationEmail(userData.email)) {
    throw new AppError("El email no tiene un formato válido", 400);
  }

  if (!validationPassword(userData.password)) {
    throw new AppError(
      "La contraseña debe tener entre 8 y 12 caracteres e incluir mayúscula, minúscula, número y carácter especial",
      400,
    );
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError("El email ya está registrado", 409);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);
  const createdUser = await User.create({
    ...userData,
    // El rol siempre es "user" en el registro público.
    role: "user",
    password: passwordHash,
  });

  return sanitizeUser(createdUser);
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email y contraseña son obligatorios", 400);
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const user = sanitizeUser(foundUser);
  const token = generateSign(String(foundUser._id), foundUser.email);

  return { user, token };
};

const getUserById = async (id) => {
  const user = await User.findById(id).populate("info");
  return sanitizeUser(user);
};

const updateUser = async (id, payload = {}) => {
  const cleanPayload = UPDATABLE_FIELDS.reduce((acc, field) => {
    if (payload[field] !== undefined) {
      acc[field] = payload[field];
    }
    return acc;
  }, {});

  const updatedUser = await User.findByIdAndUpdate(id, cleanPayload, {
    new: true,
    runValidators: true,
  }).populate("info");

  return sanitizeUser(updatedUser);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
};
