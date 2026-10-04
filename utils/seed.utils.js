const { faker } = require("@faker-js/faker");

const HOME_TYPES = ["Piso", "Casa", "Finca"];
const TENURE_TYPES = ["Alquiler", "Propiedad"];

const getRandomEnumValue = (values) =>
  values[faker.number.int({ min: 0, max: values.length - 1 })];

const getRandomBoolean = (probability = 0.5) => Math.random() < probability;

const getRandomSubset = (values, maxItems = values.length) => {
  if (values.length === 0) {
    return [];
  }
  const shuffled = faker.helpers.shuffle([...values]);
  const count = faker.number.int({
    min: 0,
    max: Math.min(maxItems, values.length),
  });
  return shuffled.slice(0, count);
};

const createSpanishMobilePhone = () => `6${faker.string.numeric(8)}`;

const createSpanishDni = () => {
  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const number = faker.number.int({ min: 10000000, max: 99999999 });
  const letter = letters[number % letters.length];
  return `${number}${letter}`;
};

const createPostalCode = () => faker.number.int({ min: 10000, max: 52999 });

// ID ficticio con el formato de RescueGroups (numérico).
const createExternalAnimalId = () =>
  String(faker.number.int({ min: 1000, max: 999999 }));

module.exports = {
  HOME_TYPES,
  TENURE_TYPES,
  getRandomEnumValue,
  getRandomBoolean,
  getRandomSubset,
  createSpanishMobilePhone,
  createSpanishDni,
  createPostalCode,
  createExternalAnimalId,
};
