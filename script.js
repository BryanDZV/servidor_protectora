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

connect().catch((error) => {
  console.error("No ha sido posible conectar con MongoDB", error);
  process.exit(1);
});

app.use(corsMiddleware);
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send(
    "<h1>Bienvenido a la API de la Protectora</h1><p>API funcionando correctamente.</p>",
  );
});

app.use("/animales", animalesRoutes);
app.use("/form", formsRouter);
app.use("/user", userRouter);
app.use("/test", testRouter);

const RESCUEGROUPS_ENDPOINT = "https://api.rescuegroups.org/http/v2.json";
const RESCUEGROUPS_APIKEY = process.env.RESCUEGROUPS_APIKEY || "nOnXnixt";

app.post("/rescuegroups", async (req, res) => {
  try {
    const upstream = await fetch(RESCUEGROUPS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, apikey: RESCUEGROUPS_APIKEY }),
    });
    const text = await upstream.text();
    res.status(upstream.status).type("application/json").send(text);
  } catch (err) {
    res.status(502).json({
      error: "Error contacting RescueGroups",
      detail: String(err && err.message ? err.message : err),
    });
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  console.error(`[Error] ${statusCode} - ${message}`);
  res.status(statusCode).json({ error: true, statusCode, message });
});

const PORT = process.env.PORT || 5002;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
  });
}

module.exports = app;
