require("dotenv").config();

const bcrypt = require("bcrypt");
const { connectDB, disconnectDB } = require("./db");
const {
  cleanupSeedCollections,
} = require("./services/seed/seed-cleanup.service");
const { seedAnimals } = require("./services/seed/animal.seed.service");
const { seedUsers } = require("./services/seed/user.seed.service");
const {
  seedAdoptionForms,
} = require("./services/seed/adoption-form.seed.service");

const parseSeedMode = () => {
  const resetArgument = process.argv.find((argument) =>
    argument.startsWith("--reset="),
  );

  if (!resetArgument) {
    return process.env.SEED_RESET || "collections";
  }

  return resetArgument.split("=")[1] || "collections";
};

const runSeed = async () => {
  try {
    await connectDB();

    const resetMode = parseSeedMode();
    await cleanupSeedCollections(resetMode);

    const passwordHash = await bcrypt.hash("12345678", 10);
    const insertedAnimals = await seedAnimals();
    const insertedUsers = await seedUsers({
      animalIds: insertedAnimals,
      passwordHash,
    });
    const insertedForms = await seedAdoptionForms({
      userIds: insertedUsers,
      animalIds: insertedAnimals,
    });

    console.log("Seed ejecutado correctamente");
    console.log(`Animales insertados: ${insertedAnimals.length}`);
    console.log(`Usuarios insertados: ${insertedUsers.length}`);
    console.log(`Formularios insertados: ${insertedForms.length}`);
  } catch (error) {
    console.error("El proceso de seeding ha fallado", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

runSeed();
