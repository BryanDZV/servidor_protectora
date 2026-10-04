const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const corsMiddleware = require("./middleware/cors");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const animalsRoutes = require("./routes/animals.routes");
const usersRoutes = require("./routes/users.routes");
const formsRoutes = require("./routes/forms.routes");

const app = express();

app.use(corsMiddleware);
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

// Documentación interactiva de la API (Swagger UI)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Documento OpenAPI en crudo, para importarlo en Postman/Insomnia u otras herramientas
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Comprueba que la API está funcionando
 *     responses:
 *       200:
 *         description: Página HTML de bienvenida
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  res.send(
    "<h1>Bienvenido a la API de la Protectora</h1><p>API funcionando correctamente.</p>",
  );
});

app.use("/animales", animalsRoutes);
app.use("/user", usersRoutes);
app.use("/form", formsRoutes);

// Ruta no encontrada (debe ir después de todas las rutas)
app.use(notFound);

// Middleware global de errores (debe ir el último)
app.use(errorHandler);

module.exports = app;
