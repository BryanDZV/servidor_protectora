const { faker } = require("@faker-js/faker");

const ANIMAL_SPECIES = ["Perro", "Gato", "Ave", "Conejo"];
const ANIMAL_AGE_RANGES = ["Cachorro", "Joven", "Adulto", "Senior"];
const ANIMAL_GENDERS = ["Macho", "Hembra"];
const ANIMAL_SIZES = ["Pequeño", "Mediano", "Grande"];
const ANIMAL_STATES = ["Disponible", "Reservado", "Adoptado"];
const HOME_TYPES = ["Piso", "Casa", "Finca"];
const TENURE_TYPES = ["Alquiler", "Propiedad"];

const getRandomEnumValue = (values) =>
  values[faker.number.int({ min: 0, max: values.length - 1 })];

const getRandomBoolean = (probability = 0.5) => Math.random() < probability;

const getRandomSubset = (values, maxItems = values.length) => {
  if (values.length === 0) {
    return [];
  }

  const shuffledValues = faker.helpers.shuffle([...values]);
  const count = faker.number.int({
    min: 0,
    max: Math.min(maxItems, values.length),
  });
  return shuffledValues.slice(0, count);
};

const getRandomBirthDateFromRange = (rangeEdad) => {
  const ageRangeMap = {
    Cachorro: [0, 1],
    Joven: [1, 3],
    Adulto: [3, 8],
    Senior: [8, 15],
  };

  const [minYears, maxYears] = ageRangeMap[rangeEdad] || [1, 8];
  const yearsAgo = faker.number.int({ min: minYears, max: maxYears });
  const extraDays = faker.number.int({ min: 0, max: 364 });
  const birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - yearsAgo);
  birthDate.setDate(birthDate.getDate() - extraDays);
  return birthDate;
};

const getAnimalWeight = (species, size) => {
  const weightRanges = {
    Perro: {
      Pequeño: [2, 8],
      Mediano: [8, 22],
      Grande: [22, 45],
    },
    Gato: {
      Pequeño: [2, 4],
      Mediano: [4, 6],
      Grande: [6, 8],
    },
    Ave: {
      Pequeño: [0.1, 0.5],
      Mediano: [0.5, 1.5],
      Grande: [1.5, 4],
    },
    Conejo: {
      Pequeño: [0.8, 1.8],
      Mediano: [1.8, 3.5],
      Grande: [3.5, 6],
    },
  };

  const [minWeight, maxWeight] = weightRanges[species]?.[size] || [1, 20];
  return Number(
    (Math.random() * (maxWeight - minWeight) + minWeight).toFixed(1),
  );
};

const createImageUrl = (seed) => `https://picsum.photos/seed/${seed}/800/600`;

const createSpanishMobilePhone = () => `6${faker.string.numeric(8)}`;

const createSpanishDni = () => {
  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const number = faker.number.int({ min: 10000000, max: 99999999 });
  const letter = letters[number % letters.length];
  return `${number}${letter}`;
};

const createPostalCode = () => faker.number.int({ min: 10000, max: 52999 });

module.exports = {
  ANIMAL_SPECIES,
  ANIMAL_AGE_RANGES,
  ANIMAL_GENDERS,
  ANIMAL_SIZES,
  ANIMAL_STATES,
  HOME_TYPES,
  TENURE_TYPES,
  getRandomEnumValue,
  getRandomBoolean,
  getRandomSubset,
  getRandomBirthDateFromRange,
  getAnimalWeight,
  createImageUrl,
  createSpanishMobilePhone,
  createSpanishDni,
  createPostalCode,
};
