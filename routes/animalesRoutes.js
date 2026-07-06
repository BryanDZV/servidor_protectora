// Importar express para crear el router
const express = require("express");
const {
  getAnimales,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalById,
} = require("../controllers/animalesControllers");

const router = express.Router();

router.get("/", getAnimales);
router.post("/", postAnimal);
router.put("/:id", putAnimal);
router.delete("/:id", deleteAnimal);
router.get("/:id", getAnimalById);

module.exports = router;
