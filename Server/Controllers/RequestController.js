const mongoose = require("mongoose");
const RequestModel = require("../Models/Request");
const UserModel = require("../Models/User");
const CopyModel = require("../Models/Copy");

// Middleware to get the current user (for example purposes, assumes user ID is provided in req.userId)
async function getCurrentUser(req, res, next) {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.currentUser = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

// Add a new request
async function addRequest(req, res) {
  try {
    const { giveCards, requestCards } = req.body;

    // Check if the current user has the giveCards
    for (let cardId of giveCards) {
      const userCopyCount = await CopyModel.countDocuments({ ownerId: req.currentUser._id, componentId: cardId });
      if (userCopyCount <=1 ) {
        return res.status(400).json({ message: `User does not have the card to give: ${cardId}` });
      }
    }

    const newRequest = new RequestModel({
      giveCards,
      requestCards,
      ownerRequest: req.currentUser._id,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error });
  }
}

// Delete a request by ID
async function deleteRequest(req, res) {
  try {
    const { requestId } = req.params;

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.ownerRequest.toString() !== req.currentUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await request.remove();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting request", error });
  }
}

// Get all requests made by the current user
async function getUserRequests(req, res) {
  try {
    const requests = await RequestModel.find({ ownerRequest: req.currentUser._id })
      .populate("giveCards")
      .populate("requestCards");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error });
  }
}

// Get requests with a specific exchange card in giveCards
async function getRequestsByCard(req, res) {
  try {
    const { cardId } = req.params;

    const requests = await RequestModel.find({
      giveCards: { $in: [cardId] }
    })
      .populate("giveCards")
      .populate("requestCards")
      .populate("ownerRequest");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests by card", error });
  }
}

// Accept a request
async function acceptRequest(req, res) {
  try {
    const { requestId } = req.params;

    // Find the request
    const request = await RequestModel.findById(requestId)
      .populate("giveCards")
      .populate("requestCards")
      .populate("ownerRequest");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify the user is not the owner of the request
    if (request.ownerRequest.toString() === req.currentUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to accept your own request" });
    }

    // Verify the current user has at least one copy of each requested card
    for (let cardId of request.requestCards) {
      const userCopyCount = await CopyModel.countDocuments({ ownerId: req.currentUser._id, componentId: cardId });
      if (userCopyCount <=1) {
        return res.status(400).json({ message: `User does not have the requested card: ${cardId}` });
      }
    }

    // Perform the swap
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Update the ownerId of the copies for the request cards
      await CopyModel.updateMany(
        { ownerId: req.currentUser._id, componentId: { $in: request.requestCards } },
        { $set: { ownerId: request.ownerRequest._id } },
        { session }
      );

      // Update the ownerId of the copies for the give cards
      await CopyModel.updateMany(
        { ownerId: request.ownerRequest._id, componentId: { $in: request.giveCards } },
        { $set: { ownerId: req.currentUser._id } },
        { session }
      );

      // Mark the request as accepted
      request.accepted = true;
      await request.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Request accepted successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
}
// Get all requests
async function getAllRequests(req, res) {
  try {
    const requests = await RequestModel.find()
      .populate("giveCards")
      .populate("requestCards")
      .populate("ownerRequest");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all requests", error });
  }
}

// Get request by ID
async function getRequestById(req, res) {
  try {
    const { requestId } = req.params;

    const request = await RequestModel.findById(requestId)
      .populate("giveCards")
      .populate("requestCards")
      .populate("ownerRequest");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request by ID", error });
  }
}

module.exports = {
  getCurrentUser,
  addRequest,
  deleteRequest,
  getUserRequests,
  getRequestsByCard,
  acceptRequest,
  getAllRequests,
  getRequestById,
};