const animalService = require("../services/animal.service");
const catchAsync = require("../utils/catchAsync");

const getAnimales = catchAsync(async (req, res) => {
  const animalesFiltrados = await animalService.getAnimales(req.query);
  return res.status(200).json(animalesFiltrados);
});

const getAnimalById = catchAsync(async (req, res) => {
  const animal = await animalService.getAnimalById(req.params.id);
  return res.status(200).json(animal);
});

const postAnimal = catchAsync(async (req, res) => {
  const createdAnimal = await animalService.createAnimal(req.body);
  return res.status(201).json(createdAnimal);
});

const putAnimal = catchAsync(async (req, res) => {
  const updatedAnimal = await animalService.updateAnimal(
    req.params.id,
    req.body,
  );
  return res.status(200).json(updatedAnimal);
});

const deleteAnimal = catchAsync(async (req, res) => {
  const deletedAnimal = await animalService.deleteAnimal(req.params.id);
  return res.status(200).json(deletedAnimal);
});

// Exportar todas las funciones para poder usarlas en otros módulos
module.exports = {
  getAnimales,
  getAnimalById,
  postAnimal,
  putAnimal,
  deleteAnimal,
};
