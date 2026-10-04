const mongoose = require("mongoose");
const { Schema } = mongoose;

const adoptionFormSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // ID del animal en RescueGroups (el animal no vive en Mongo).
    animalExternalId: { type: String, required: true, index: true, trim: true },
    telf: { type: String, required: true, trim: true },
    dni: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    postal: { type: Number, required: true },
    city: { type: String, required: true, trim: true },
    petFriendly: { type: Boolean, required: true },
    tieneMascotas: { type: Boolean, required: true },
    tipoVivienda: {
      type: String,
      required: true,
      enum: ["Piso", "Casa", "Finca"],
    },
    alquilerOCompra: {
      type: String,
      required: true,
      enum: ["Alquiler", "Propiedad"],
    },
    permisoCasero: { type: Boolean, required: true },
    tieneJardin: { type: Boolean, required: true },
    acuerdoVisitas: { type: Boolean, required: true },
  },
  { timestamps: true, collection: "forms" },
);

module.exports = mongoose.model("AdoptionForm", adoptionFormSchema);
