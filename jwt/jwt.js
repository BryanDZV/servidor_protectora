const jwt = require("jsonwebtoken");

// Función para generar un token JWT firmado
const generateSign = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_KEY, { expiresIn: "1w" });
};

const verifySign = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return null; // Si el token expira o es inválido, devolvemos null en vez de romper la app
  }
};

// Exportar ambas funciones para poder usarlas en otros módulos
module.exports = {
  generateSign,
  verifySign,
};
