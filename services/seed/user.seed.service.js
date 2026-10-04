const User = require("../../models/User");
const {
  getRandomSubset,
  createExternalAnimalId,
} = require("../../utils/seed.utils");
const usersData = require("../../Data/users.data.json");

const buildFakeExternalIds = (count) =>
  Array.from({ length: count }, () => createExternalAnimalId());

const seedUsers = async ({ passwordHash }) => {
  try {
    await User.deleteMany({});

    const usersPayload = usersData.map((user) => ({
      name: user.name,
      email: user.email,
      password: passwordHash,
      role: user.role === "admin" ? "admin" : "user",
      favPets: getRandomSubset(buildFakeExternalIds(5), 2),
    }));

    return await User.insertMany(usersPayload);
  } catch (error) {
    throw new Error(`Falló el seeding de la colección User: ${error.message}`);
  }
};

module.exports = { seedUsers };
