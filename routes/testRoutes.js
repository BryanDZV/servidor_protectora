// Importar express para crear el router
const express = require("express");
// Crear una instancia de Router de Express
const router = express.Router();
const animalService = require("../services/animal.service");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/test-animales",
  catchAsync(async (req, res) => {
    const animals = await animalService.getAnimales({});
    return res.status(200).json(animals);
  }),
);

// Exportar el router para poder usarlo en el archivo principal
module.exports = router;
