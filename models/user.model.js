const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: false },
    image: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    inProcessPets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    favPets: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
    info: [{ type: Schema.Types.ObjectId, ref: "Form" }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
