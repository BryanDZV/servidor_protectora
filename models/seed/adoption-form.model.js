const mongoose = require("mongoose");

const adoptionFormSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    telf: { type: String, required: true, trim: true },
    dni: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    postal: { type: Number, required: true },
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
  {
    timestamps: true,
    collection: "forms",
  },
);

module.exports =
  mongoose.models.AdoptionForm ||
  mongoose.model("AdoptionForm", adoptionFormSchema);
