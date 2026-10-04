const cors = require("cors");
const config = require("../config/env");

// Lista blanca de orígenes (el origin del frontend). Sin `credentials: true`
// el navegador no enviaría ni aceptaría la cookie httpOnly cross-origin.
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  credentials: true,
};

module.exports = cors(corsOptions);
