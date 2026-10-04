const config = require("../config/env");
const AppError = require("../utils/AppError");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Campos que pedimos a RescueGroups.
const FIELDS = [
  "animalID",
  "animalOrgID",
  "animalName",
  "animalSpecies",
  "animalBreed",
  "animalSex",
  "animalGeneralAge",
  "animalBirthdate",
  "animalSizeCurrent",
  "animalGeneralSizePotential",
  "animalStatus",
  "animalAdoptionPending",
  "animalAltered",
  "animalUptodate",
  "animalMicrochipped",
  "animalDescription",
  "animalDescriptionPlain",
  "animalThumbnailUrl",
  "animalPictures",
  "animalLocation",
  "animalLocationCitystate",
  "locationCity",
  "locationState",
  "animalAdoptionFee",
  "animalAffectionate",
  "animalPlayful",
  "animalGentle",
  "animalIntelligent",
  "animalObedient",
  "animalEventempered",
  "animalTimid",
  "animalEagerToPlease",
  "animalIndependent",
];

const SPECIES_MAP = {
  dog: "Perro",
  cat: "Gato",
  rabbit: "Conejo",
  horse: "Caballo",
  bird: "Ave",
  "small furry": "Pequeño mamífero",
  barnyard: "Granja",
  reptile: "Reptil",
};
const SPECIES_TO_EN = {
  perro: "Dog",
  gato: "Cat",
  conejo: "Rabbit",
  caballo: "Horse",
  ave: "Bird",
  reptil: "Reptile",
};
const SEX_MAP = { male: "Macho", female: "Hembra" };
const SEX_TO_EN = { macho: "Male", hembra: "Female" };
const AGE_MAP = {
  baby: "Cachorro",
  young: "Joven",
  adult: "Adulto",
  senior: "Senior",
};
const AGE_TO_EN = {
  cachorro: "Baby",
  joven: "Young",
  adulto: "Adult",
  senior: "Senior",
};
const SIZE_MAP = { small: "Pequeño", medium: "Mediano", large: "Grande" };
const SIZE_TO_EN = { pequeño: "Small", mediano: "Medium", grande: "Large" };
const STATUS_MAP = {
  available: "Disponible",
  adopted: "Adoptado",
  pending: "Reservado",
  "adoption pending": "Reservado",
};

const normalizeKey = (value) => String(value ?? "").trim().toLowerCase();

const mapValue = (map, value, fallback) =>
  map[normalizeKey(value)] || fallback || "";

const isYes = (value) =>
  value === true || normalizeKey(value) === "yes";

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return 0;
  }
  const parsed = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const stripHtml = (html) => {
  if (!html) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&(#?[a-z0-9]+);/gi, " ")
    .trim();
};

// RescueGroups sirve las fotos por CDN y el "thumbnail" viene a ?width=100
// (100 px), que se ve fatal al ampliarlo. Pedimos una resolución decente.
const normalizePictureUrl = (url) => {
  if (typeof url !== "string" || !url) {
    return null;
  }

  if (url.includes("cdn.rescuegroups.org")) {
    const clean = url.split("?")[0];
    return `${clean}?width=800`;
  }

  return url;
};

const pickPictures = (raw) => {
  const pictures = raw.animalPictures;
  const urls = [];

  if (raw.animalThumbnailUrl) {
    urls.push(raw.animalThumbnailUrl);
  }

  if (Array.isArray(pictures)) {
    for (const picture of pictures) {
      if (typeof picture === "string") {
        urls.push(picture);
      } else if (picture && typeof picture === "object") {
        urls.push(
          picture.url ||
            picture.largeUrl ||
            picture.mediumUrl ||
            picture.thumbnailUrl,
        );
      }
    }
  }

  return [...new Set(urls.filter(Boolean).map(normalizePictureUrl))];
};

const buildPersonality = (raw) => {
  const traits = [
    { key: "animalAffectionate", label: "Cariñoso" },
    { key: "animalPlayful", label: "Juguetón" },
    { key: "animalGentle", label: "Tranquilo" },
    { key: "animalIntelligent", label: "Inteligente" },
    { key: "animalObedient", label: "Obediente" },
    { key: "animalEventempered", label: "Equilibrado" },
    { key: "animalTimid", label: "Tímido" },
    { key: "animalEagerToPlease", label: "Complaciente" },
    { key: "animalIndependent", label: "Independiente" },
  ];
  return traits.filter((trait) => isYes(raw[trait.key])).map((t) => t.label);
};

// Traduce el animal de RescueGroups a nuestro DTO limpio.
const mapAnimal = (raw = {}) => {
  const pictures = pickPictures(raw);

  return {
    id: String(raw.animalID ?? ""),
    nombre: raw.animalName || "Sin nombre",
    especie: mapValue(SPECIES_MAP, raw.animalSpecies, raw.animalSpecies),
    genero: mapValue(SEX_MAP, raw.animalSex, raw.animalSex),
    rangoEdad: mapValue(AGE_MAP, raw.animalGeneralAge, raw.animalGeneralAge),
    fechaNacimiento: raw.animalBirthdate ?? null,
    size: mapValue(
      SIZE_MAP,
      raw.animalSizeCurrent || raw.animalGeneralSizePotential,
      "",
    ),
    peso: parseNumber(raw.animalWeight),
    salud: {
      vacunado: isYes(raw.animalUptodate),
      desparasitado: isYes(raw.animalUptodate),
      sano: true,
      esterilizado: isYes(raw.animalAltered),
      identificado: false,
      microchip: isYes(raw.animalMicrochipped),
    },
    personalidad: buildPersonality(raw),
    historia: stripHtml(
      raw.animalDescription || raw.animalDescriptionPlain || "",
    ),
    aSaber: "",
    requisitosAdopcion: "",
    tasaAdopcion: parseNumber(raw.animalAdoptionFee),
    permiteEnvio: true,
    ubicacion:
      raw.animalLocationCitystate ||
      raw.animalLocation ||
      [raw.locationCity, raw.locationState].filter(Boolean).join(", "),
    foto: pictures[0] || "",
    imagenes: pictures,
    estadoAdopcion: isYes(raw.animalAdoptionPending)
      ? "Reservado"
      : mapValue(STATUS_MAP, raw.animalStatus, "Disponible"),
  };
};

// Convierte los filtros de query de nuestra API a los filtros de RescueGroups.
const buildFilters = (query = {}) => {
  const filters = [
    { fieldName: "animalStatus", operation: "equals", criteria: "Available" },
  ];

  if (query.especie) {
    filters.push({
      fieldName: "animalSpecies",
      operation: "equals",
      criteria: mapValue(SPECIES_TO_EN, query.especie, query.especie),
    });
  }
  if (query.genero) {
    filters.push({
      fieldName: "animalSex",
      operation: "equals",
      criteria: mapValue(SEX_TO_EN, query.genero, query.genero),
    });
  }
  if (query.rangoEdad) {
    filters.push({
      fieldName: "animalGeneralAge",
      operation: "equals",
      criteria: mapValue(AGE_TO_EN, query.rangoEdad, query.rangoEdad),
    });
  }
  if (query.size) {
    filters.push({
      fieldName: "animalGeneralSizePotential",
      operation: "equals",
      criteria: mapValue(SIZE_TO_EN, query.size, query.size),
    });
  }
  if (query.texto) {
    filters.push({
      fieldName: "animalName",
      operation: "contains",
      criteria: query.texto,
    });
  }

  return filters;
};

// RescueGroups incluye un registro "instructivo" que no es un animal real.
const isPlaceholder = (record) => {
  const name = String(record.animalName ?? "").toLowerCase();
  return (
    name.includes("adoption-read") ||
    name.includes("read first") ||
    name.includes("instructions")
  );
};

const extractRecords = (payload) => {
  const data = payload?.data;
  if (!data) return [];
  const records = Array.isArray(data) ? data : Object.values(data);
  return records.filter(
    (record) =>
      record && typeof record === "object" && !isPlaceholder(record),
  );
};

const extractTotalItems = (payload, fallback) => {
  const total =
    payload?.foundRows ??
    payload?.meta?.resultTotalCount ??
    payload?.meta?.totalCount ??
    payload?.meta?.resultTotal ??
    null;

  if (total === null || total === undefined || total === "") {
    return fallback;
  }

  const parsed = Number(total);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requestRescueGroups = async (body) => {
  let response;

  try {
    response = await fetch(config.rescueGroups.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, apikey: config.rescueGroups.apiKey }),
    });
  } catch (error) {
    throw new AppError(
      `No se pudo contactar con RescueGroups (${error.message})`,
      502,
    );
  }

  if (!response.ok) {
    throw new AppError(
      `RescueGroups respondió con error ${response.status}`,
      502,
    );
  }

  return response.json();
};

/**
 * Lista animales paginados desde RescueGroups.
 * Devuelve el DTO normalizado + paginación estándar.
 */
const getAnimals = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const payload = await requestRescueGroups({
    objectType: "animals",
    objectAction: "publicSearch",
    search: {
      resultStart: String((page - 1) * limit),
      resultLimit: String(limit),
      resultSort: "animalID",
      resultOrder: "asc",
      filterProcessing: "1",
      filters: buildFilters(query),
      fields: FIELDS,
    },
  });

  const data = extractRecords(payload).map(mapAnimal);
  const totalItems = extractTotalItems(payload, (page - 1) * limit + data.length);

  return {
    data,
    pagination: {
      totalItems,
      currentPage: page,
      totalPages: limit > 0 ? Math.ceil(totalItems / limit) : 1,
      limit,
    },
  };
};

/**
 * Obtiene un animal concreto de RescueGroups (o null si no existe).
 */
const getAnimalById = async (id) => {
  const payload = await requestRescueGroups({
    objectType: "animals",
    objectAction: "publicView",
    values: [{ animalID: id }],
    fields: FIELDS,
  });

  const [record] = extractRecords(payload);
  return record ? mapAnimal(record) : null;
};

module.exports = {
  getAnimals,
  getAnimalById,
  mapAnimal,
};
