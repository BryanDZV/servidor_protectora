// Importar mongoose para trabajar con MongoDB
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    especie: {
      type: String,
      required: true,
      enum: ["Perro", "Gato", "Ave", "Conejo"],
    },
    rangoEdad: {
      type: String,
      required: true,
      enum: ["Cachorro", "Joven", "Adulto", "Senior"],
      alias: "edad",
    },
    fechaNacimiento: { type: Date, required: true, alias: "fechaDeNacimiento" },
    genero: { type: String, required: true, enum: ["Macho", "Hembra"] },
    size: {
      type: String,
      required: true,
      enum: ["Pequeño", "Mediano", "Grande"],
    },
    peso: { type: Number, required: true },
    salud: {
      vacunado: { type: Boolean, required: true },
      desparasitado: { type: Boolean, required: true },
      sano: { type: Boolean, required: true },
      esterilizado: { type: Boolean, required: true },
      identificado: { type: Boolean, required: true },
      microchip: { type: Boolean, required: true },
    },
    nombre: { type: String, required: true, trim: true },
    foto: { type: String, required: true, trim: true },
    ubicacion: { type: String, required: true, trim: true },
    personalidad: [{ type: String, required: true, trim: true }],
    historia: { type: String, required: true, trim: true },
    aSaber: { type: String, required: true, trim: true },
    requisitosAdopcion: { type: String, required: true, trim: true },
    tasaAdopcion: { type: Number, required: true },
    permiteEnvio: { type: Boolean, required: true, alias: "seEnvia" },
    estadoAdopcion: {
      type: String,
      required: true,
      enum: ["Disponible", "Reservado", "Adoptado"],
      alias: "adoptionState",
    },
  },
  { timestamps: true, collection: "Animales" },
);

const Animal = mongoose.model("Animal", animalSchema, "Animales");
module.exports = Animal;
