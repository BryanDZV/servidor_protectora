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
 *     summary: Landing de la API (enlaces a la documentación y a la demo)
 *     responses:
 *       200:
 *         description: Página HTML de bienvenida
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API Protectora de Animales</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        background: linear-gradient(180deg, #f7fbfc 0%, #e3eef0 100%);
        color: #173648;
      }
      main {
        max-width: 620px;
        margin: 1.5rem;
        padding: 2.5rem;
        background: #fff;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(15, 31, 47, 0.1);
        text-align: center;
      }
      h1 { margin: 0 0 0.5rem; font-size: 1.9rem; }
      p { color: #5c7382; line-height: 1.5; }
      nav { display: grid; gap: 0.75rem; margin-top: 1.75rem; }
      a {
        display: block;
        padding: 0.9rem 1.2rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
      }
      a.primary { background: linear-gradient(135deg, #1d5c74, #01748e); color: #fff; }
      a.ghost { border: 1px solid rgba(34, 67, 102, 0.2); color: #1d5c74; }
      small { display: block; margin-top: 1.5rem; color: #8aa0ab; }
    </style>
  </head>
  <body>
    <main>
      <h1>🐾 API Protectora de Animales</h1>
      <p>
        Backend for Frontend (BFF): animales de <strong>RescueGroups</strong>,
        usuarios y formularios en <strong>MongoDB</strong>, autenticación por
        cookie <code>httpOnly</code>.
      </p>
      <nav>
        <a class="primary" href="/api-docs">Documentación (Swagger UI)</a>
        <a class="ghost" href="/api-docs.json">OpenAPI JSON</a>
        <a class="ghost" href="${config.frontendUrl}">Demo del frontend</a>
      </nav>
      <small>Express · MongoDB · RescueGroups · Node 24</small>
    </main>
  </body>
</html>`);
});

app.use("/animales", animalsRoutes);
app.use("/user", usersRoutes);
app.use("/form", formsRoutes);

// Ruta no encontrada (debe ir después de todas las rutas)
app.use(notFound);

// Middleware global de errores (debe ir el último)
app.use(errorHandler);

module.exports = app;
