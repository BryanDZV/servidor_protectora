const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: false, trim: true },
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
      enum: ["user", "admin", "tester"],
      default: "user",
      trim: true,
    },
    pets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    inProcessPets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    favPets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    info: [{ type: Schema.Types.ObjectId, ref: "AdoptionForm" }],
  },
  { timestamps: true, collection: "users" },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
