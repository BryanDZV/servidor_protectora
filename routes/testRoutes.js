const express = require("express");
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

module.exports = router;
