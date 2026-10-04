const config = require("../config/env");

// Extrae el JWT. Prioridad:
//   1. Cookie httpOnly `jwt` (uso normal del frontend).
//   2. Header `Authorization: Bearer <token>` (Swagger UI / Postman / API clients).
const extractToken = (req) => {
  const cookieToken = req.cookies?.[config.cookie.name];
  if (cookieToken) {
    return cookieToken;
  }

  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }

  return null;
};

module.exports = extractToken;
