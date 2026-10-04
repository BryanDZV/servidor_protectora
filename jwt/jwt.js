const jwt = require("jsonwebtoken");
const config = require("../config/env");

// Función para generar un token JWT firmado
const generateSign = (id, email) => {
  return jwt.sign({ id, email }, config.jwtKey, {
    expiresIn: config.jwtExpiresIn,
  });
};

const verifySign = (token) => {
  try {
    return jwt.verify(token, config.jwtKey);
  } catch (error) {
    return null; // Si el token expira o es inválido, devolvemos null en vez de romper la app
  }
};

// Exportar ambas funciones para poder usarlas en otros módulos
module.exports = {
  generateSign,
  verifySign,
};
