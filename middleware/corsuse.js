const cors = require("cors");

// Centralizamos los orígenes permitidos (Local de node, Local de Angular, Producción en Vercel)
const allowedOrigins = [
  "http://localhost:5002",
  "http://localhost:4200",
  "https://protectora-orcin.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  credentials: true,
};

module.exports = cors(corsOptions);
