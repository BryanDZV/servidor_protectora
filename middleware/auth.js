// Importar la función verifySign para verificar tokens JWT
const { verifySign } = require("../jwt/jwt");
// Importar el modelo User para buscar usuarios en la base de datos
const User = require("../models/user.model");

// Middleware para verificar que el usuario está autenticado
const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No autorizado. Token no proporcionado o formato inválido.",
      });
    }

    const token = authorization.split(" ")[1];
    const tokenVerified = verifySign(token);

    if (!tokenVerified) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const userLogged = await User.findById(tokenVerified.id).populate(
      "pets favPets inProcessPets info",
    );
    if (!userLogged) {
      return res
        .status(404)
        .json({ message: "Usuario asociado al token no encontrado" });
    }

    userLogged.password = undefined; // 'undefined' evita que viaje en el JSON final
    req.user = userLogged;
    next(); // Pasa correctamente al controlador
  } catch (error) {
    return res.status(500).json({
      message: "Error interno en la autenticación",
      error: error.message,
    });
  }
};

module.exports = { isAuth };
