const mongoose = require("mongoose");

const connect = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URL);
    const { name, host } = db.connection;
    console.log(
      `Conectado correctamente a la base de datos de ${name} db en el host ${host}`,
    );
  } catch (error) {
    console.error(" Hemos tenido un error al conectar a la BBDD", error);
    process.exit(1); // Detenemos la ejecución si no hay base de datos
  }
};

module.exports = { connect };
