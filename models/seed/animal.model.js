const mongoose = require("mongoose");

const saludSchema = new mongoose.Schema(
  {
    vacunado: { type: Boolean, required: true },
    desparasitado: { type: Boolean, required: true },
    sano: { type: Boolean, required: true },
    esterilizado: { type: Boolean, required: true },
    identificado: { type: Boolean, required: true },
    microchip: { type: Boolean, required: true },
  },
  { _id: false },
);

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
    },
    fechaNacimiento: { type: Date, required: true },
    genero: { type: String, required: true, enum: ["Macho", "Hembra"] },
    size: {
      type: String,
      required: true,
      enum: ["Pequeño", "Mediano", "Grande"],
    },
    peso: { type: Number, required: true },
    salud: { type: saludSchema, required: true },
    nombre: { type: String, required: true, trim: true },
    foto: { type: String, required: true, trim: true },
    ubicacion: { type: String, required: true, trim: true },
    personalidad: [{ type: String, required: true, trim: true }],
    historia: { type: String, required: true, trim: true },
    aSaber: { type: String, required: true, trim: true },
    requisitosAdopcion: { type: String, required: true, trim: true },
    tasaAdopcion: { type: Number, required: true },
    permiteEnvio: { type: Boolean, required: true },
    estadoAdopcion: {
      type: String,
      required: true,
      enum: ["Disponible", "Reservado", "Adoptado"],
    },
  },
  {
    timestamps: true,
    collection: "Animales",
  },
);

module.exports =
  mongoose.models.Animal || mongoose.model("Animal", animalSchema);
