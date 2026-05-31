const User = require("../../models/user.model");
const { getRandomSubset } = require("../../utils/seed.utils");
const usersData = require("../../Data/users.data.json");

const seedUsers = async ({ animalIds, passwordHash }) => {
  try {
    await User.deleteMany({});

    const usersPayload = usersData.map((user) => ({
      name: user.name,
      email: user.email,
      password: passwordHash,
      role: user.role || "user",
      favPets: getRandomSubset(animalIds, 5),
    }));

    const insertedUsers = await User.insertMany(usersPayload);

    return insertedUsers;
  } catch (error) {
    throw new Error(`Falló el seeding de la colección User: ${error.message}`);
  }
};

module.exports = { seedUsers };
