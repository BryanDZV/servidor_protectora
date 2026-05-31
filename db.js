const mongoose = require("mongoose");

const connectDB = async (uri = process.env.DB_URL) => {
  if (!uri) {
    throw new Error("DB_URL no está definida en el entorno");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const db = await mongoose.connect(uri);
  const { name, host } = db.connection;
  console.log(
    `Conectado correctamente a la base de datos de ${name} en el host ${host}`,
  );

  return db;
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("Conexión con MongoDB cerrada correctamente");
  }
};

module.exports = { connect: connectDB, connectDB, disconnectDB };
