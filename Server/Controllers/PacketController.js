const mongoose = require("mongoose");
const PacketModel = require("../Models/Packet");
const PacketCopyModel = require("../Models/PacketCopy");
const UserModel = require("../Models/User");
const CopyModel = require("../Models/Copy"); 
const CardModel = require("../Models/Cards"); // Assuming this is the model for components

// Function to create a new packet type
async function createPacket(req, res) {
  try {
    if (req.currentUser.admin !== true) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(req.body);
    const { name, numberOfCards, price, image } = req.body;

    const newPacket = new PacketModel({
      Name: name,
      img: image,
      Ncarte: numberOfCards,
      Price: price,
    });

    await newPacket.save();
    res.status(201).json(newPacket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating packet", error });
  }
}
async function deletePacket(req, res) {
  if (req.currentUser.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    await PacketModel.findByIdAndDelete(id);
    await PacketCopyModel.deleteMany({ packetId: id });
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: "Error deleting packet", error });
  }
}
// Function to open a packet copy
async function openPacket(req, res) {
  try {
    const { packetId } = req.params;
    const userId = req.currentUser._id;
    // Find the packet copy for the current user
    const packetCopy = await PacketCopyModel.findOne({ _id: packetId, ownerId: userId });
    if (!packetCopy) {
      return res.status(404).json({ message: "Packet copy not found" });
    }

    // Find the original packet details using the packetId in the packet copy
    const originalPacket = await PacketModel.findById(packetCopy.packetId);
    if (!originalPacket) {
      return res.status(404).json({ message: "Original packet not found" });
    }
    const nCards = originalPacket.Ncarte || 5; 

    const components = await CardModel.aggregate([{ $sample: { size: nCards } }]);
    const componentIds = components.map(component => component._id);
   
    const copies = componentIds.map(componentId => ({
      cardId: componentId,
      ownerId: userId,
    }));
    
    await CopyModel.insertMany(copies);
    const cards = await CardModel.find({ _id: { $in: componentIds } });
    await PacketCopyModel.deleteOne({ _id: packetCopy._id });
    res.status(200).json({ cards });
  } catch (error) {
    res.status(500).json({ message: "Error opening packet", error });
  }
}

// Function to buy a packet
async function buyPacket(req, res) {
  try {
    const { packetId } = req.body;
    const userId = req.currentUser._id;

    const packet = await PacketModel.findById(packetId);
    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    const user = await UserModel.findById(userId);
    if (user.credits < packet.Cost) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    user.credits -= packet.Price;
    await user.save();

    const newPacketCopy = new PacketCopyModel({
      packetId: packet._id,
      ownerId: userId,
    });

    await newPacketCopy.save();
    res.status(201).json(newPacketCopy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error buying packet", error });
  }
}

// Function to get all packets
async function getAllPackets(req, res) {
  try {
    const packets = await PacketModel.find();
    res.status(200).json(packets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packets", error });
  }
}

const getAllUnopenedPackets = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const unopenedPackets = await PacketCopyModel.find({ ownerId: userId});

    res.status(200).json(unopenedPackets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unopened packets", error });
  }
};
const getPacketById = async (req, res) => {
  const { id } = req.params;
  try {
    const Packet = await PacketModel.findById(id);

    res.status(200).json(Packet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching packet", error });
  }
};


module.exports = {
  getAllUnopenedPackets,
  createPacket,
  openPacket,
  buyPacket,
  deletePacket,
  getAllPackets,
  getPacketById
};
