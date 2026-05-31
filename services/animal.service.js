const Animal = require("../models/animalModel");

const normalizeAnimalPayload = (payload = {}) => {
  const salud = payload.salud || {
    vacunado: payload.vacunado,
    desparasitado: payload.desparasitado,
    sano: payload.sano,
    esterilizado: payload.esterilizado,
    identificado: payload.identificado,
    microchip: payload.microchip,
  };

  return {
    especie: payload.especie,
    rangoEdad: payload.rangoEdad || payload.edad,
    fechaNacimiento: payload.fechaNacimiento || payload.fechaDeNacimiento,
    genero: payload.genero,
    size: payload.size,
    peso: payload.peso,
    salud,
    nombre: payload.nombre,
    foto: payload.foto,
    ubicacion: payload.ubicacion,
    personalidad: payload.personalidad || [],
    historia: payload.historia,
    aSaber: payload.aSaber,
    requisitosAdopcion: payload.requisitosAdopcion,
    tasaAdopcion: payload.tasaAdopcion,
    permiteEnvio:
      typeof payload.permiteEnvio === "boolean"
        ? payload.permiteEnvio
        : payload.seEnvia,
    estadoAdopcion: payload.estadoAdopcion || payload.adoptionState,
  };
};

const getAnimales = async (query = {}) => {
  return Animal.find(query).sort({ createdAt: -1 }).lean();
};

const getAnimalById = async (id) => {
  return Animal.findById(id).lean();
};

const createAnimal = async (payload) => {
  const createdAnimal = await Animal.create(normalizeAnimalPayload(payload));
  return createdAnimal.toObject();
};

const updateAnimal = async (id, payload) => {
  const { _id, ...cleanPayload } = payload || {};

  return Animal.findByIdAndUpdate(id, normalizeAnimalPayload(cleanPayload), {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteAnimal = async (id) => {
  return Animal.findByIdAndDelete(id).lean();
};

module.exports = {
  getAnimales,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};
