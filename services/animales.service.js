const Favorite = require("../models/favorite.model");
const AdminModification = require("../models/adminModification.model");

const getMergedAnimals = async (userId, filters = {}) => {
  let externalAnimals = [];

  // 1. Obtener datos de la API Externa (RescueGroups.org v5)
  try {
    const response = await fetch(process.env.RESCUE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.RESCUE_API_KEY,
      },
      // Si el controlador no pasa filtros, se enviará un objeto vacío {}
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP de RescueGroups: ${response.status}`);
    }

    const responseData = await response.json();
    // La API v5 de RescueGroups envía el array de animales dentro de la propiedad "data"
    externalAnimals = responseData.data || [];
  } catch (error) {
    console.error("RescueGroups API Error:", error.message);
    // Lanzamos un error 502 (Bad Gateway) porque falló un servicio externo
    const apiError = new Error(
      "Bad Gateway: Falló la comunicación con la API de RescueGroups.",
    );
    apiError.statusCode = 502;
    throw apiError;
  }

  // 2. Obtener Favoritos del usuario (si userId existe)
  let userFavorites = new Set();
  if (userId) {
    const favorites = await Favorite.find({ userId }).lean();
    userFavorites = new Set(favorites.map((f) => String(f.externalAnimalId)));
  }

  // 3. Obtener modificaciones del Admin
  const externalIds = externalAnimals.map((animal) => String(animal.id));
  const modifications = await AdminModification.find({
    externalAnimalId: { $in: externalIds },
  }).lean();

  const modificationsMap = modifications.reduce((acc, mod) => {
    acc[mod.externalAnimalId] = mod;
    return acc;
  }, {});

  // 4. EL CRUCE DE DATOS (Data Merge)
  const mergedAnimals = externalAnimals.map((animal) => {
    const animalIdStr = String(animal.id);
    const adminMod = modificationsMap[animalIdStr];

    return {
      ...animal, // Clonamos todo el objeto (normalmente incluye animal.attributes)
      nombrePersonalizado:
        adminMod?.customName ||
        (animal.attributes ? animal.attributes.name : null),
      estadoAdopcion: adminMod?.status || "Disponible",
      isFavorite: userFavorites.has(animalIdStr),
    };
  });

  return mergedAnimals;
};

module.exports = { getMergedAnimals };
