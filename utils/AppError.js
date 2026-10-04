/**
 * Error de aplicación con código HTTP.
 * Se lanza desde los services/controladores y lo captura el middleware
 * global de errores, que responde con el statusCode indicado.
 *
 *   throw new AppError("Animal no encontrado", 404);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // error esperado (no un fallo de programación)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
