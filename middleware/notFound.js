// Middleware para rutas no encontradas. Se registra después de todas las rutas.
const notFound = (req, res) => {
  res.status(404).json({
    error: true,
    statusCode: 404,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
