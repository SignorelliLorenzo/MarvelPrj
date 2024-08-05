const mongoose = require("mongoose");
const CopyModel = require("../Models/Copy");
const CardModel= require("../Models/Cards");
// Function to add a new card
async function addCard(req, res) {
  
  try {
    if(req.currentUser.admin == false) return res.status(403).json({ message: "Not authorized" });
    const { Nome, Descrizione, Img, Details } = req.body;

    const newComponent = new CardModel({
      Nome,
      Descrizione,
      Img,
      Details,
    });

    await newComponent.save();
    res.status(201).json(newComponent);
  } catch (error) {
    res.status(500).json({ message: "Error adding card", error });
  }
}

// Function to delete a card
async function deleteCard(req, res) {
  try {
    if(req.currentUser.admin == false) return res.status(403).json({ message: "Not authorized" });
    const { cardId } = req.params;

    await CardModel.findByIdAndDelete(cardId);
    await CopyModel.deleteMany({ componentId: cardId });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error });
  }
}

// Function to get all cards
async function getAllCards(req, res) {
  try {
    const cards = await CardModel.find();
    res.status(200).json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching cards", error });
  }
}

// Function to get all cards of a user and their duplicates
async function getUserCards(req, res) {
  try {
    const userId = req.currentUser._id;

    const userCopies = await CopyModel.find({ ownerId: userId }).populate('componentId');
    const cardCounts = {};

    userCopies.forEach(copy => {
      const cardId = copy.componentId._id;
      if (!cardCounts[cardId]) {
        cardCounts[cardId] = {
          card: copy.componentId,
          count: 0,
        };
      }
      cardCounts[cardId].count++;
    });

    const userCards = Object.values(cardCounts);
    res.status(200).json(userCards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user cards", error });
  }
}

// Function to get a card by ID
async function getCardById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid card ID" });
    }
    const card = await CardModel.findById(id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Error fetching card", error });
  }
}

module.exports = {
  addCard,
  deleteCard,
  getAllCards,
  getUserCards,
  getCardById,
};
