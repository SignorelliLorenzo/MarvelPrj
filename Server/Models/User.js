const mongoose = require("mongoose");
const CardsModel = require("./Cards");
const Schema = mongoose.Schema;

// Define the UserSchema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  credits: { type: Number, required: true, default: 0 },
  profileImage: { type: String,default:"" }, 
  admin: { type: Boolean, required: true, default: false },
  favHero: { type: Schema.Types.ObjectId, ref: "Card", default: null },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;