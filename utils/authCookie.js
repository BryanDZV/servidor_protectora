const config = require("../config/env");

// Opciones de la cookie httpOnly donde viaja el JWT.
const baseCookieOptions = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  path: "/",
};

const setAuthCookie = (res, token) => {
  return res.cookie(config.cookie.name, token, {
    ...baseCookieOptions,
    maxAge: config.cookie.maxAge,
  });
};

const clearAuthCookie = (res) => {
  return res.clearCookie(config.cookie.name, baseCookieOptions);
};

module.exports = { setAuthCookie, clearAuthCookie };
