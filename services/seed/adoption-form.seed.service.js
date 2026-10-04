const { faker } = require("@faker-js/faker");
const AdoptionForm = require("../../models/AdoptionForm");
const User = require("../../models/User");
const {
  HOME_TYPES,
  TENURE_TYPES,
  getRandomEnumValue,
  getRandomBoolean,
  createSpanishMobilePhone,
  createSpanishDni,
  createPostalCode,
  createExternalAnimalId,
} = require("../../utils/seed.utils");

const seedAdoptionForms = async ({ userIds }) => {
  try {
    await AdoptionForm.deleteMany({});

    const formsPayload = Array.from({ length: 15 }, () => ({
      user: faker.helpers.arrayElement(userIds),
      animalExternalId: createExternalAnimalId(),
      telf: createSpanishMobilePhone(),
      dni: createSpanishDni(),
      city: faker.location.city(),
      direccion: faker.location.streetAddress(),
      postal: createPostalCode(),
      petFriendly: getRandomBoolean(0.8),
      tieneMascotas: getRandomBoolean(0.45),
      tipoVivienda: getRandomEnumValue(HOME_TYPES),
      alquilerOCompra: getRandomEnumValue(TENURE_TYPES),
      permisoCasero: getRandomBoolean(0.75),
      tieneJardin: getRandomBoolean(0.4),
      acuerdoVisitas: getRandomBoolean(0.85),
    }));

    const insertedForms = await AdoptionForm.insertMany(formsPayload);

    // Mantenemos las referencias del usuario coherentes con sus formularios.
    await Promise.all(
      insertedForms.map((form) =>
        User.updateOne(
          { _id: form.user },
          {
            $addToSet: {
              inProcessPets: form.animalExternalId,
              info: form._id,
            },
          },
        ),
      ),
    );

    return insertedForms;
  } catch (error) {
    throw new Error(
      `Falló el seeding de la colección AdoptionForm: ${error.message}`,
    );
  }
};

module.exports = { seedAdoptionForms };
