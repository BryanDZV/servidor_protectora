const mongoose = require("mongoose");

const SEED_COLLECTIONS = ["users", "forms"];

const cleanupSeedCollections = async (mode = "collections") => {
  if (!mongoose.connection.db) {
    throw new Error(
      "No hay conexión activa con MongoDB para limpiar colecciones",
    );
  }

  if (mode === "database") {
    await mongoose.connection.dropDatabase();
    console.log("Base de datos eliminada antes del seed");
    return;
  }

  if (mode !== "collections") {
    throw new Error(
      `Modo de limpieza no soportado: ${mode}. Usa collections o database.`,
    );
  }

  const existingCollections = await mongoose.connection.db
    .listCollections()
    .toArray();
  const existingNames = new Set(
    existingCollections.map((collection) => collection.name),
  );

  for (const collectionName of SEED_COLLECTIONS) {
    if (existingNames.has(collectionName)) {
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Colección eliminada antes del seed: ${collectionName}`);
    }
  }
};

module.exports = { cleanupSeedCollections, SEED_COLLECTIONS };
