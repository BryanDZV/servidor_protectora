// Punto de entrada: valida el entorno, conecta a MongoDB y levanta el servidor.
// La configuración de Express vive en app.js (así el app es reutilizable/testeable).
const app = require("./app");
const config = require("./config/env");
const { connect } = require("./config/db");

if (!config.dbUrl || !config.jwtKey) {
  console.error(
    "Faltan variables de entorno obligatorias: DB_URL y/o JWT_KEY. Revisa tu .env",
  );
  process.exit(1);
}

connect().catch((error) => {
  console.error("No ha sido posible conectar con MongoDB", error);
  process.exit(1);
});

// En Vercel la app se ejecuta como función serverless: no se usa listen.
if (!config.isVercel) {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto: ${config.port}`);
  });
}

module.exports = app;
