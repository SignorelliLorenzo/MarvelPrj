const mongoose = require("mongoose");
const RequestModel = require("../Models/Request");
const UserModel = require("../Models/User");
const CopyModel = require("../Models/Copy");
const CardsModel = require("../Models/Cards");
// Add a new request
async function addRequest(req, res) {
  try {
    const { offeredCards, requestedCard, credits } = req.body;

    // Controllo 1: Verifica che le carte richieste non siano anche offerte
    const duplicateCards = requestedCard.filter(cardId => offeredCards.includes(cardId));
    if (duplicateCards.length > 0) {
      return res.status(400).json({
        message: `Cannot request and offer the same card(s)`,
      });
    }

    // Controllo 2: Verifica che l'utente non possieda già le carte richieste
    const userRequestedCopies = await CopyModel.find({
      ownerId: req.currentUser._id,
      cardId: { $in: requestedCard },
    });

    if (userRequestedCopies.length > 0) {
      const alreadyOwnedCards = userRequestedCopies.map(copy => copy.cardId);
      return res.status(400).json({
        message: `Cannot request card(s) that the user already owns`,
      });
    }

    // Controlla che l'utente abbia tutte le carte offerte
    for (let cardId of offeredCards) {
      const userCopyCount = await CopyModel.countDocuments({
        ownerId: req.currentUser._id,
        cardId: cardId,
      });
      if (userCopyCount < 1) {
        return res
          .status(400)
          .json({ message: `User does not have the card to give: ${cardId}` });
      }
    }

    let givecopys = [];
    // Rimuove la proprietà dell'utente dalle carte offerte impostando ownerId a null
    for (let cardId of offeredCards) {
      const givecopy = await CopyModel.findOne({
        ownerId: req.currentUser._id,
        cardId: cardId,
      });
      const result = await CopyModel.updateOne(
        { _id: givecopy._id },
        { $set: { ownerId: null } }
      );
      givecopys.push(givecopy._id);
    }

    // Crea una nuova richiesta
    const newRequest = new RequestModel({
      tradedCards: givecopys,
      requestedCards: requestedCard,
      ownerRequest: req.currentUser._id,
      credits: credits,
    });

    await newRequest.save();

    // Popola le relazioni con le carte scambiate, richieste e l'utente
    const populatedRequest = await RequestModel.findById(newRequest._id)
      .populate({
        path: "tradedCards",
        populate: {
          path: "cardId", // Popola la proprietà 'cardId' del modello 'Copy'
          model: "Card",  // Specifica il modello 'Card' per ottenere i dettagli della carta
        },
      })
      .populate("requestedCards") // Popola le carte richieste
      .populate({
        path: "ownerRequest",
        select: "username", // Recupera solo lo username dell'utente
      });

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating request", error });
  }
}


// Delete a request by ID
async function deleteRequest(req, res) {
  try {
    const { requestId } = req.params;
    console.log(requestId);
    const request = await RequestModel.findById(requestId);
    if (!request || request.accepted) {
      return res.status(404).json({ message: "Invalid request" });
    }

    if (request.ownerRequest.toString() !== req.currentUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await CopyModel.updateMany(
      { _id: { $in: request.tradedCards } },
      { $set: { ownerId: request.ownerRequest } }
    );

   // await RequestModel.updateOne({ _id: requestId } , { $set: { accepted: true } });
    await RequestModel.findByIdAndDelete(requestId) ;
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting request", error });
  }
}

// Get all requests made by the current user
async function getUserRequests(req, res) {
  try {
    const requests = await RequestModel.find({
      ownerRequest: req.currentUser._id,
    })
      .populate("tradedCards")
      .populate("requestedCards");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error });
  }
}

async function getRequestsByCard(req, res) {
  try {
    const { cardId } = req.params;

    const requests = await RequestModel.find({
      tradedCards: { $in: [cardId] },
    })
      .populate("tradedCards")
      .populate("requestedCards")
      .populate("ownerRequest");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests by card", error });
  }
}


async function acceptRequest(req, res) {
  try {
    const { tradeId } = req.params;

    // Find the request with populated fields
    const request = await RequestModel.findById(tradeId)
      .populate("tradedCards")
      .populate("requestedCards")
      .populate("ownerRequest");

    // Check if request exists
    if (!request || request.accepted) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify the user is not the owner of the request
    if (request.ownerRequest._id.equals(req.currentUser._id)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to accept your own request" });
    }

    // Verify the current user has at least two copy of each requested card
    for (let card of request.requestedCards) {
      const userCopyCount = await CopyModel.countDocuments({
        ownerId: req.currentUser._id,
        cardId: card._id,
      });
    
      if (userCopyCount < 2) {
        return res.status(400).json({
          message: `User does not have at least 2 copies of the requested card: ${card._id}`,
        });
      }
    }

    if(request.credits>req.currentUser.credits){
      return res.status(400).json({
        message: `User does not have enough credits`,
      })
    }
    for (let card of request.tradedCards) {
      const userCopyCount = await CopyModel.countDocuments({
        ownerId: req.currentUser._id,
        cardId: card.cardId,
      });
    
      if (userCopyCount > 0) {
        return res.status(400).json({
          message: `User already has this cards`,
        });
      }
    }
    // Update ownership for one copy of each requested card
    for (let card of request.requestedCards) {
      const userCopy = await CopyModel.findOne({
        ownerId: req.currentUser._id,
        cardId: card._id,
      });

      if (userCopy) {
        userCopy.ownerId = request.ownerRequest._id;
        await userCopy.save();
      }
    }

    // Update ownership for the specific copies of the traded cards
    console.log(req.currentUser._id)
    for (let tradedCardCopy of request.tradedCards) {
      const userCopy = await CopyModel.findById(tradedCardCopy._id);

      if (userCopy) {
        userCopy.ownerId = req.currentUser._id;
        await userCopy.save();
      }
    }
    req.currentUser.credits-=request.credits
    const usr= await UserModel.findById(request.ownerRequest._id)
    usr.credits+=request.credits
    await usr.save()
    await req.currentUser.save()
    
    // Mark the request as accepted
    request.accepted = true;
    await request.save();

    return res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({ message: "Error accepting request" });
  }
}



// Get all requests
async function getAllRequests(req, res) {
  const { limit, cardName, notAccepted } = req.query; // Get limit, cardName, and notAccepted from query parameters

  try {
    const query = {};

    // If cardName is provided, add it to the query to filter requested cards
    if (cardName) {
      query["requestedCards.Name"] = { $regex: `^${cardName}`, $options: "i" }; // Case-insensitive filter
    }

    // If notAccepted is provided and true, add the filter to exclude accepted requests
    if (notAccepted === 'false') {
      query.accepted = false;
    }

    // Fetch requests with optional filtering
    let requestQuery = RequestModel.find(query)
      .populate({
        path: "tradedCards",
        populate: {
          path: "cardId", // First populate the 'cardId' from the Copy model
          model: "Card", // Specify the 'Card' model to retrieve the actual card details
        },
      })
      .populate("requestedCards")
      .populate({
        path: "ownerRequest",
        select: "username", // Only populating the username field from the User model
      });

    // If limit is provided, apply it
    if (limit) {
      requestQuery = requestQuery.limit(parseInt(limit));
    }

    const requests = await requestQuery.exec();

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching all requests", error: error });
  }
}

// Get request by ID
async function getRequestById(req, res) {
  try {
    const { requestId } = req.params;

    const request = await RequestModel.findById(requestId)
      .populate({
        path: "tradedCards",
        populate: {
          path: "cardId", // First populate the 'cardId' from the Copy model
          model: "Card", // Specify the 'Card' model to retrieve the actual card details
        },
      })
      .populate("requestedCards") 
      .populate({
        path: "ownerRequest",
        select: "username", // Only populating the username field from the User model
      });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request by ID", error });
  }
}

module.exports = {
  addRequest,
  deleteRequest,
  getUserRequests,
  getRequestsByCard,
  acceptRequest,
  getAllRequests,
  getRequestById,
};
