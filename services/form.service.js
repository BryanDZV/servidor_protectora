const mongoose = require("mongoose");
const Form = require("../models/forms.model");
const Animal = require("../models/animalModel");
const User = require("../models/user.model");

const normalizeFormPayload = (payload = {}) => ({
  user_id: payload.user_id || payload.userId,
  animal_id: payload.animal_id || payload.animalId,
  telf: payload.telf,
  dni: payload.dni,
  city: payload.city,
  direccion: payload.direccion || payload.direction,
  postal: payload.postal,
  petFriendly:
    typeof payload.petFriendly === "boolean"
      ? payload.petFriendly
      : payload.petfrienly,
  tieneMascotas:
    typeof payload.tieneMascotas === "boolean"
      ? payload.tieneMascotas
      : payload.pets,
  tipoVivienda: payload.tipoVivienda || payload.home,
  alquilerOCompra: payload.alquilerOCompra || payload.rental,
  permisoCasero:
    typeof payload.permisoCasero === "boolean"
      ? payload.permisoCasero
      : payload.casero,
  tieneJardin:
    typeof payload.tieneJardin === "boolean"
      ? payload.tieneJardin
      : payload.garden,
  acuerdoVisitas:
    typeof payload.acuerdoVisitas === "boolean"
      ? payload.acuerdoVisitas
      : payload.visit,
});

const getForms = async () => {
  return Form.find()
    .populate("user_id animal_id")
    .sort({ createdAt: -1 })
    .lean();
};

const getFormById = async (id) => {
  return Form.findById(id).populate("user_id animal_id").lean();
};

const createForm = async (payload) => {
  const normalizedPayload = normalizeFormPayload(payload);
  const session = await mongoose.startSession();

  try {
    let createdForm = null;

    await session.withTransaction(async () => {
      const selectedAnimal = await Animal.findById(
        normalizedPayload.animal_id,
      ).session(session);

      if (!selectedAnimal) {
        const error = new Error("No se ha encontrado el animal solicitado");
        error.statusCode = 404;
        throw error;
      }

      if (selectedAnimal.estadoAdopcion === "Adoptado") {
        const error = new Error(
          "El animal ya está adoptado y no admite nuevas solicitudes",
        );
        error.statusCode = 409;
        throw error;
      }

      [createdForm] = await Form.create([normalizedPayload], { session });

      await Animal.updateOne(
        { _id: selectedAnimal._id },
        { $set: { estadoAdopcion: "Reservado" } },
        { session },
      );

      await User.updateOne(
        { _id: normalizedPayload.user_id },
        {
          $addToSet: {
            inProcessPets: selectedAnimal._id,
            info: createdForm._id,
          },
        },
        { session },
      );
    });

    return createdForm.toObject();
  } finally {
    session.endSession();
  }
};

const updateForm = async (id, payload) => {
  const { _id, ...cleanPayload } = payload || {};

  return Form.findByIdAndUpdate(id, normalizeFormPayload(cleanPayload), {
    new: true,
    runValidators: true,
  })
    .populate("user_id animal_id")
    .lean();
};

const deleteForm = async (id) => {
  return Form.findByIdAndDelete(id).lean();
};

module.exports = {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
};
