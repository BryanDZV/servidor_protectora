const { verifySign } = require("../jwt/jwt");
const User = require("../models/User");
const extractToken = require("../utils/extractToken");

// Middleware de autenticación obligatoria.
// El token se busca en la cookie httpOnly y, si no está, en `Authorization: Bearer`.
const isAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        message: "No autorizado. Inicia sesión.",
      });
    }

    const tokenVerified = verifySign(token);

    if (!tokenVerified) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const userLogged = await User.findById(tokenVerified.id);
    if (!userLogged) {
      return res
        .status(404)
        .json({ message: "Usuario asociado al token no encontrado" });
    }

    userLogged.password = undefined;
    req.user = userLogged;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Error interno en la autenticación",
      error: error.message,
    });
  }
};

module.exports = { isAuth };
