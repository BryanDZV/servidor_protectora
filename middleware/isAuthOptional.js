const { verifySign } = require("../jwt/jwt");
const User = require("../models/User");
const extractToken = require("../utils/extractToken");

// Autenticación OPCIONAL: se usa en endpoints públicos que se personalizan
// si hay sesión (por ejemplo, GET /animales para marcar favoritos).
// El token se busca en la cookie o, si no, en `Authorization: Bearer`.
// Nunca lanza error: si no hay token válido, continúa sin inyectar req.user.
const isAuthOptional = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next();
    }

    const tokenVerified = verifySign(token);

    if (!tokenVerified) {
      return next();
    }

    const userLogged = await User.findById(tokenVerified.id);
    if (userLogged) {
      userLogged.password = undefined;
      req.user = userLogged;
    }

    return next();
  } catch (error) {
    // En auth opcional, cualquier fallo se trata como "invitado".
    return next();
  }
};

module.exports = { isAuthOptional };
