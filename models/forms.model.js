const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
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
    telf: { type: String, required: true },
    dni: { type: String, required: true },
    direccion: { type: String, required: true, alias: "direction" },
    postal: { type: Number, required: true },
    city: { type: String, required: true },
    petFriendly: { type: Boolean, required: true, alias: "petfrienly" },
    tieneMascotas: { type: Boolean, required: true, alias: "pets" },
    tipoVivienda: {
      type: String,
      required: true,
      enum: ["Piso", "Casa", "Finca"],
      alias: "home",
    },
    alquilerOCompra: {
      type: String,
      required: true,
      enum: ["Alquiler", "Propiedad"],
      alias: "rental",
    },
    permisoCasero: { type: Boolean, required: true, alias: "casero" },
    tieneJardin: { type: Boolean, required: true, alias: "garden" },
    acuerdoVisitas: { type: Boolean, required: true, alias: "visit" },
  },
  { timestamps: true, collection: "forms" },
);

const Form = mongoose.model("AdoptionForm", formSchema, "forms");
module.exports = Form;
