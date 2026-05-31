const { faker } = require("@faker-js/faker");
const Animal = require("../../models/animalModel");
const {
  ANIMAL_SPECIES,
  ANIMAL_AGE_RANGES,
  ANIMAL_GENDERS,
  ANIMAL_SIZES,
  ANIMAL_STATES,
  getRandomEnumValue,
  getRandomBoolean,
  getRandomBirthDateFromRange,
  getAnimalWeight,
  createImageUrl,
} = require("../../utils/seed.utils");

const PERSONALITIES = [
  "Cariñoso",
  "Juguetón",
  "Tranquilo",
  "Curioso",
  "Sociable",
  "Protector",
  "Independiente",
  "Inteligente",
  "Activo",
  "Mimoso",
];

const HISTORIES = [
  "Ha sido rescatado y ahora busca una familia estable.",
  "Llegó a la protectora tras una situación de abandono y necesita cariño.",
  "Es un animal noble que se adapta muy bien a entornos tranquilos.",
  "Tiene un carácter dulce y aprende rápido con refuerzo positivo.",
  "Está listo para encontrar un hogar definitivo y seguro.",
];

const KNOWS = [
  "Necesita rutinas estables y refuerzo positivo.",
  "Disfruta de paseos o juegos cortos varias veces al día.",
  "Convive mejor en un entorno tranquilo y predecible.",
  "Agradece mucho el contacto suave y los espacios cómodos.",
  "Se adapta bien cuando se respeta su tiempo de confianza.",
];

const REQUIREMENTS = [
  "Se requiere seguimiento de adaptación durante las primeras semanas.",
  "Debe contar con una familia responsable y comprometida.",
  "Es recomendable un hogar con tiempo suficiente para cuidarlo.",
  "Se priorizan adopciones con experiencia previa en mascotas.",
  "Necesita atención veterinaria preventiva y una rutina estable.",
];

const buildRandomAnimal = () => {
  const especie = getRandomEnumValue(ANIMAL_SPECIES);
  const rangoEdad = getRandomEnumValue(ANIMAL_AGE_RANGES);
  const size = getRandomEnumValue(ANIMAL_SIZES);

  return {
    especie,
    rangoEdad,
    fechaNacimiento: getRandomBirthDateFromRange(rangoEdad),
    genero: getRandomEnumValue(ANIMAL_GENDERS),
    size,
    peso: getAnimalWeight(especie, size),
    salud: {
      vacunado: getRandomBoolean(0.85),
      desparasitado: getRandomBoolean(0.8),
      sano: getRandomBoolean(0.9),
      esterilizado: getRandomBoolean(0.7),
      identificado: getRandomBoolean(0.65),
      microchip: getRandomBoolean(0.55),
    },
    nombre: faker.person.firstName(),
    foto: createImageUrl(faker.string.uuid()),
    ubicacion: faker.location.city(),
    personalidad: faker.helpers.shuffle([...PERSONALITIES]).slice(0, 3),
    historia: faker.helpers.arrayElement(HISTORIES),
    aSaber: faker.helpers.arrayElement(KNOWS),
    requisitosAdopcion: faker.helpers.arrayElement(REQUIREMENTS),
    tasaAdopcion: faker.number.int({ min: 20, max: 250 }),
    permiteEnvio: getRandomBoolean(0.35),
    estadoAdopcion: getRandomEnumValue(ANIMAL_STATES),
  };
};

const buildBelieverAnimal = () => ({
  especie: "Conejo",
  rangoEdad: "Adulto",
  fechaNacimiento: getRandomBirthDateFromRange("Adulto"),
  genero: "Macho",
  size: "Pequeño",
  peso: 2.4,
  salud: {
    vacunado: true,
    desparasitado: true,
    sano: true,
    esterilizado: true,
    identificado: true,
    microchip: false,
  },
  nombre: "Believer",
  foto: createImageUrl("believer-conejo"),
  ubicacion: faker.location.city(),
  personalidad: ["Cariñoso", "Curioso", "Tranquilo"],
  historia:
    "Es un conejo muy especial que busca una familia paciente y cariñosa.",
  aSaber: "Le encanta comer perejil y cilantro",
  requisitosAdopcion:
    "Necesita una adopción responsable con espacio seguro y rutina estable.",
  tasaAdopcion: 35,
  permiteEnvio: false,
  estadoAdopcion: "Disponible",
});

const seedAnimals = async () => {
  try {
    await Animal.deleteMany({});

    const animalsPayload = [
      buildBelieverAnimal(),
      ...Array.from({ length: 49 }, buildRandomAnimal),
    ];
    const insertedAnimals = await Animal.insertMany(animalsPayload);

    return insertedAnimals;
  } catch (error) {
    throw new Error(
      `Falló el seeding de la colección Animal: ${error.message}`,
    );
  }
};

module.exports = { seedAnimals };
