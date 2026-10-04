const animalsService = require("../services/animals.service");
const catchAsync = require("../utils/catchAsync");

const getAnimals = catchAsync(async (req, res) => {
  const result = await animalsService.getAnimals(req.query, req.user);
  return res.status(200).json(result);
});

const getAnimalById = catchAsync(async (req, res) => {
  const animal = await animalsService.getAnimalById(req.params.id, req.user);
  return res.status(200).json(animal);
});

module.exports = {
  getAnimals,
  getAnimalById,
};
