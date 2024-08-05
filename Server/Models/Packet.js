const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./User");

// Define the new schema that references the component and owner
const CopySchema = new Schema({
  Name: { type: String, required: true },
  Ncarte: { type: Schema.Types.ObjectId, required: true },
  Cost: { type: Number, required: true },
});

const PacketModel = mongoose.model("Packet", CopySchema);

module.exports = PacketModel;
