const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      trim: true,
    },
    // IDs externos de RescueGroups (los animales no viven en Mongo).
    favPets: { type: [String], default: [] },
    inProcessPets: { type: [String], default: [] },
    pets: { type: [String], default: [] },
    // Solicitudes de adopción (sí viven en Mongo).
    info: [{ type: Schema.Types.ObjectId, ref: "AdoptionForm" }],
  },
  { timestamps: true, collection: "users" },
);

module.exports = mongoose.model("User", userSchema);
