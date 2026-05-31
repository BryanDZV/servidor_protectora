/**
 * Envuelve funciones asíncronas de los controladores para capturar errores
 * automáticamente y pasarlos al middleware global de Express (next).
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
