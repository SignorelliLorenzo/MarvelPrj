const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./User");

// Define the new schema that references the component and owner
const CopySchema = new Schema({
  Name: { type: String, required: true },
  Ncarte: { type: Number, required: true },
  Price: { type: Number, required: true },
  img:{type:String, required:true},
});

const PacketModel = mongoose.model("Packet", CopySchema);

module.exports = PacketModel;
