const config = require("./config/env");
const bcrypt = require("bcryptjs");
const { connectDB, disconnectDB } = require("./config/db");
const {
  cleanupSeedCollections,
} = require("./services/seed/seed-cleanup.service");
const { seedUsers } = require("./services/seed/user.seed.service");
const {
  seedAdoptionForms,
} = require("./services/seed/adoption-form.seed.service");

const parseSeedMode = () => {
  const resetArgument = process.argv.find((argument) =>
    argument.startsWith("--reset="),
  );

  if (!resetArgument) {
    return config.seedReset;
  }

  return resetArgument.split("=")[1] || "collections";
};

const runSeed = async () => {
  try {
    await connectDB();

    const resetMode = parseSeedMode();
    await cleanupSeedCollections(resetMode);

    const passwordHash = await bcrypt.hash("12345678", 10);
    const insertedUsers = await seedUsers({ passwordHash });
    const insertedForms = await seedAdoptionForms({
      userIds: insertedUsers.map((user) => user._id),
    });

    console.log("Seed ejecutado correctamente");
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
