const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, trim: true },
    favPets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
  },
  {
    timestamps: true,
    collection: "users",
  },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
