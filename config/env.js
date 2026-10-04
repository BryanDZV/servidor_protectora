// Carga el archivo .env y centraliza el acceso a las variables de entorno.
// Ningún otro módulo lee process.env directamente.
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

const parseOrigins = (value, fallback) =>
  (value || fallback)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const config = {
  port: process.env.PORT || 5002,
  dbUrl: process.env.DB_URL,
  jwtKey: process.env.JWT_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  // Cookie httpOnly donde viaja el JWT.
  cookie: {
    name: "jwt",
    maxAge: Number(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // 1 día
    // En local (mismo sitio) vale "strict"; en producción cross-site
    // (front y back en dominios distintos) hay que usar "none" + secure.
    sameSite: process.env.COOKIE_SAMESITE || "strict",
    secure: isProduction,
  },
  // Orígenes permitidos para CORS (el origin del frontend, no la URL de la API).
  corsOrigins: parseOrigins(
    process.env.CORS_ORIGINS,
    "http://localhost:4200,http://localhost:5002,https://protectora-orcin.vercel.app",
  ),
  rescueGroups: {
    // API v2 de RescueGroups (formato publicSearch / publicView).
    apiUrl:
      process.env.RESCUEGROUPS_API_URL ||
      "https://api.rescuegroups.org/http/v2.json",
    apiKey: process.env.RESCUEGROUPS_APIKEY || "nOnXnixt",
  },
  seedReset: process.env.SEED_RESET || "collections",
  isProduction,
  isVercel,
};

module.exports = config;
