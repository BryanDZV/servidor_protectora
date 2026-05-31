const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connect } = require("./db");
const corsMiddleware = require("./middleware/corsuse");
const userRouter = require("./routes/userRoutes");
const formsRouter = require("./routes/formsRoutes");
const animalesRoutes = require("./routes/animalesRoutes");
const testRouter = require("./routes/testRoutes");

const app = express();

connect();

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
app.use("/form", formsRouter);
app.use("/user", userRouter);
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto : ${PORT}`);
});
