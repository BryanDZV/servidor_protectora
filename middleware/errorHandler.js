// Middleware global de errores. Express lo reconoce porque tiene 4 argumentos.
// Traduce distintos tipos de error a una respuesta JSON homogénea.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  // ObjectId con formato inválido
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Identificador no válido: ${err.value}`;
  }

  // Índice único duplicado (por ejemplo, email)
  if (err.code === 11000) {
    statusCode = 409;
    message = `Valor duplicado: ${Object.keys(err.keyValue).join(", ")}`;
  }

  // Errores de Multer (subida de archivos)
  if (err.name === "MulterError") {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.message;
  }

  // Solo registramos en consola los errores inesperados (5xx)
  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({ error: true, statusCode, message });
};

module.exports = errorHandler;
