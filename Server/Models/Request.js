const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Import the Component and User models to reference their schemas
const ComponentModel = require("./Copy");
const CardsModel = require("./Cards");
const UserModel = require("./User");

// Define the RequestSchema
const RequestSchema = new Schema({
  credits: { type: Number, required: true, default: 0 },
  tradedCards: [{ type: Schema.Types.ObjectId, ref: "Copy", required: true }], // quelle che dai
  requestedCards: [{ type: Schema.Types.ObjectId, ref: "Card", required: false }], // quelle che richiedi
  ownerRequest: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accepted: { type: Boolean, required: true, default: false },
});

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;