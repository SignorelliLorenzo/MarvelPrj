const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardsModel = require("./Cards");
const UserModel = require("./User");

// Define the new schema that references the component and owner
const CopySchema = new Schema({
  cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

const CopyModel = mongoose.model("Copy", CopySchema);

module.exports = CopyModel;
