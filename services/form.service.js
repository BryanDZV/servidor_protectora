const mongoose = require("mongoose");
const Form = require("../models/AdoptionForm");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const buildFormFields = (payload = {}) => ({
  animalExternalId: payload.animalExternalId,
  telf: payload.telf,
  dni: payload.dni,
  direccion: payload.direccion,
  postal: payload.postal,
  city: payload.city,
  petFriendly: payload.petFriendly,
  tieneMascotas: payload.tieneMascotas,
  tipoVivienda: payload.tipoVivienda,
  alquilerOCompra: payload.alquilerOCompra,
  permisoCasero: payload.permisoCasero,
  tieneJardin: payload.tieneJardin,
  acuerdoVisitas: payload.acuerdoVisitas,
});

const isAdmin = (user) => user?.role === "admin";

// `form.user` es un ObjectId o, si está populado, un documento de usuario.
const ownerIdOf = (form) => String(form.user?._id ?? form.user);

const assertOwnership = (form, user) => {
  if (!form) {
    throw new AppError("Formulario no encontrado", 404);
  }
  if (!isAdmin(user) && ownerIdOf(form) !== String(user._id)) {
    throw new AppError("No tienes permiso para acceder a este formulario", 403);
  }
};

const getForms = async (user) => {
  // El admin ve todos; un usuario solo los suyos.
  const filter = isAdmin(user) ? {} : { user: user._id };
  return Form.find(filter).populate("user").sort({ createdAt: -1 }).lean();
};

const getFormById = async (id, user) => {
  const form = await Form.findById(id).populate("user").lean();
  assertOwnership(form, user);
  return form;
};

const createForm = async (userId, payload) => {
  const fields = buildFormFields(payload);

  if (!fields.animalExternalId) {
    throw new AppError("El id del animal es obligatorio", 400);
  }

  const session = await mongoose.startSession();

  try {
    let createdForm = null;

    await session.withTransaction(async () => {
      [createdForm] = await Form.create([{ ...fields, user: userId }], {
        session,
      });

      await User.updateOne(
        { _id: userId },
        {
          $addToSet: {
            inProcessPets: fields.animalExternalId,
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

const updateForm = async (id, user, payload) => {
  const form = await Form.findById(id);
  assertOwnership(form, user);

  return Form.findByIdAndUpdate(id, buildFormFields(payload), {
    new: true,
    runValidators: true,
  })
    .populate("user")
    .lean();
};

const deleteForm = async (id, user) => {
  const form = await Form.findById(id);
  assertOwnership(form, user);

  const deletedForm = await Form.findByIdAndDelete(id).lean();

  // Limpiamos las referencias del usuario. Solo quitamos el animal de
  // `inProcessPets` si no le quedan más formularios para ese mismo animal.
  const stillInProcess = await Form.exists({
    user: deletedForm.user,
    animalExternalId: deletedForm.animalExternalId,
  });

  const pull = { info: deletedForm._id };
  if (!stillInProcess) {
    pull.inProcessPets = deletedForm.animalExternalId;
  }

  await User.updateOne({ _id: deletedForm.user }, { $pull: pull });

  return deletedForm;
};

module.exports = {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
};
