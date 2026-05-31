const { faker } = require("@faker-js/faker");
const AdoptionForm = require("../../models/forms.model");
const {
  HOME_TYPES,
  TENURE_TYPES,
  getRandomBoolean,
  getRandomEnumValue,
  createSpanishMobilePhone,
  createSpanishDni,
  createPostalCode,
} = require("../../utils/seed.utils");

const seedAdoptionForms = async ({ userIds, animalIds }) => {
  try {
    await AdoptionForm.deleteMany({});

    const formsPayload = Array.from({ length: 15 }, () => {
      const selectedUser = faker.helpers.arrayElement(userIds);
      const selectedAnimal = faker.helpers.arrayElement(animalIds);

      return {
        user_id: selectedUser._id,
        animal_id: selectedAnimal._id,
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
      };
    });

    const insertedForms = await AdoptionForm.insertMany(formsPayload);

    return insertedForms;
  } catch (error) {
    throw new Error(
      `Falló el seeding de la colección AdoptionForm: ${error.message}`,
    );
  }
};

module.exports = { seedAdoptionForms };
