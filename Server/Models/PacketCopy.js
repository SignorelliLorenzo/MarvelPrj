const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PacketModel = require("./Packet");
const UserModel = require("./User");

// Define the new schema that references the component and owner
const PacketCopySchema = new Schema({
  packetId: { type: Schema.Types.ObjectId, ref: "Packet", required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const PacketCopyModel = mongoose.model("PacketCopy", PacketCopySchema);

module.exports = PacketCopyModel;