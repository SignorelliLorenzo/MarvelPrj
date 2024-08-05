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
    const { Name, Ncards, Cost } = req.body;

    const newPacket = new PacketModel({
      Name,
      Ncards,
      Cost,
    });

    await newPacket.save();
    res.status(201).json(newPacket);
  } catch (error) {
    res.status(500).json({ message: "Error creating packet", error });
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

    // Assuming Ncards is the number of cards to be opened
    const nCards = originalPacket.Ncards || 5; // Default to 5 if not specified in original packet

    // Get random components
    const components = await CardModel.aggregate([{ $sample: { size: nCards } }]);
    const componentIds = components.map(component => component._id);

    // Create copies of the components and associate them with the user
    const copies = componentIds.map(componentId => ({
      componentId,
      ownerId: userId,
    }));

    await CopyModel.insertMany(copies);

    res.status(200).json({ cardIds: componentIds });
  } catch (error) {
    res.status(500).json({ message: "Error opening packet", error });
  }
}

// Function to buy a packet
async function buyPacket(req, res) {
  try {
    const { packetId } = req.params;
    const userId = req.currentUser._id;

    const packet = await PacketModel.findById(packetId);
    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    const user = await UserModel.findById(userId);
    if (user.crediti < packet.Cost) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    user.crediti -= packet.Cost;
    await user.save();

    const newPacketCopy = new PacketCopyModel({
      packetId: packet._id,
      ownerId: userId,
    });

    await newPacketCopy.save();
    res.status(201).json(newPacketCopy);
  } catch (error) {
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
    const unopenedPackets = await PacketCopyModel.find({ ownerId: userId, opened: false });

    res.status(200).json(unopenedPackets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unopened packets", error });
  }
};


module.exports = {
  getAllUnopenedPackets,
  createPacket,
  openPacket,
  buyPacket,
  getAllPackets,
};
