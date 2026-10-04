const rescueGroups = require("./rescueGroups.service");
const AdoptionForm = require("../models/AdoptionForm");
const User = require("../models/User");
const AppError = require("../utils/AppError");

// Consulta en Mongo, en una sola tanda, qué animales están en proceso
// (tienen formulario) y cuáles adoptados (están en los `pets` de algún usuario).
const buildLocalState = async (externalIds) => {
  const empty = { inProcess: new Set(), adopted: new Set() };
  if (!externalIds || externalIds.length === 0) {
    return empty;
  }

  const [forms, adopters] = await Promise.all([
    AdoptionForm.find({ animalExternalId: { $in: externalIds } })
      .select("animalExternalId")
      .lean(),
    User.find({ pets: { $in: externalIds } })
      .select("pets")
      .lean(),
  ]);

  const inProcess = new Set(forms.map((form) => form.animalExternalId));
  const adopted = new Set(
    adopters
      .flatMap((user) => user.pets)
      .filter((id) => externalIds.includes(id)),
  );

  return { inProcess, adopted };
};

// Estado local derivado (null = se mantiene el estado que da RescueGroups).
const localStatusOf = (id, { inProcess, adopted }) => {
  if (adopted.has(id)) return "Adoptado";
  if (inProcess.has(id)) return "Reservado";
  return null;
};

const enrichAnimal = (animal, favorites, localState) => ({
  ...animal,
  isFavorite: favorites.has(animal.id),
  localAdoptionStatus: localStatusOf(animal.id, localState),
});

const getAnimals = async (query = {}, user = null) => {
  const { data, pagination } = await rescueGroups.getAnimals(query);
  const localState = await buildLocalState(data.map((animal) => animal.id));
  const favorites = new Set(user?.favPets || []);

  return {
    data: data.map((animal) => enrichAnimal(animal, favorites, localState)),
    pagination,
  };
};

const getAnimalById = async (id, user = null) => {
  const animal = await rescueGroups.getAnimalById(id);
  if (!animal) {
    throw new AppError("Animal no encontrado", 404);
  }

  const localState = await buildLocalState([animal.id]);
  const favorites = new Set(user?.favPets || []);

  return enrichAnimal(animal, favorites, localState);
};

module.exports = { getAnimals, getAnimalById };
