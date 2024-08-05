const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the UserSchema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  credits: { type: Number, required: true, default: 0 },
  profileImage: { type: String }, // New field for profile image
  admin: { type: Boolean, required: true, default: false }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;