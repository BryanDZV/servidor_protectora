// Importar el framework Express para crear el servidor
const express = require("express");
// Importar dotenv para gestionar variables de entorno
const dotenv = require("dotenv");
// Configurar dotenv para cargar las variables del archivo .env
dotenv.config();

const { connect } = require("./db");
const corsMiddleware = require("./middleware/corsuse");
const userRouter = require("./routes/userRoutes");
// Router para gestionar formularios de adopción
const formsRouter = require("./routes/formsRoutes");
// Router para gestionar los animales
const animalesRoutes = require("./routes/animalesRoutes");
// Router para rutas de prueba
const testRouter = require("./routes/testRoutes");

const app = express();

connect().catch((error) => {
  console.error("No ha sido posible conectar con MongoDB", error);
  process.exit(1);
});

// Middlewares globales
app.use(corsMiddleware);
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send(
    "<h1>Bienvenido a la API de la Protectora</h1><p>API funcionando correctamente.</p>",
  );
});

// Rutas de API
app.use("/animales", animalesRoutes);
// Todas las rutas que empiecen con /form usarán formsRouter
app.use("/form", formsRouter);
// Todas las rutas que empiecen con /user usarán userRouter
app.use("/user", userRouter);
// Todas las rutas que empiecen con /test usarán testRouter
app.use("/test", testRouter);

// Middleware Global de Manejo de Errores
// Aquí llegan todos los errores arrojados por nuestro "catchAsync" en los controladores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    error: true,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 5002;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(` Servidor escuchando en el puerto : ${PORT}`);
  });
}

module.exports = app;
