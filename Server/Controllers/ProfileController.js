const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User.js");
const PacketCopyModel = require("../Models/PacketCopy");
const CopyModel = require("../Models/Copy");
const RequestModel = require("../Models/Request");

async function deleteProfile(req, res) {
  try {
    const userId = req.currentUser._id;

    await PacketCopyModel.deleteMany({ ownerId: userId });
    await CopyModel.deleteMany({ ownerId: userId });

    await RequestModel.deleteMany({ ownerRequest: userId, accepted: false });

    await RequestModel.updateMany(
      { ownerRequest: userId, accepted: true },
      { $set: { ownerRequest: null } }
    );
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "Profile and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
}

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Username or email already in use." 
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    sendToken(user, 201, res);

  } catch (err) {
    console.log(err);

    // Specific error handling based on the type of error
    if (err.name === "ValidationError") {
      // Handle validation errors, e.g., missing required fields
      return res.status(400).json({ 
        success: false, 
        message: "Validation error. Please ensure all required fields are filled correctly.", 
        error: err.message 
      });
    }

    if (err.code === 11000) {
      // Handle duplicate key errors (for unique fields like email/username)
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        success: false, 
        message: `Duplicate field: ${field}. This ${field} is already taken.`,
        error: err.message 
      });
    }

    // Fallback for all other server errors
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: err.message 
    });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ success: false, error: "Invalid credentials" });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  const { username, profileImage, password, favHero } = req.body;
  try {
    const updateFields = {};
    // Check if new username is provided
    if (favHero) {
      updateFields.favHero = favHero;
    }
    if (username) {
      updateFields.username = username;
    }
    // Check if new profile image is provided
    if (profileImage) {
      updateFields.profileImage = profileImage;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    const user = await User.findByIdAndUpdate(req.currentUser._id, updateFields, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};


// Add credits to user
const addCredits = async (req, res) => {
  const { credits } = req.body;
  try {
    const user = await User.findById(req.currentUser._id);
    user.credits += credits;
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Helper function to send token
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  res.status(statusCode).json({ success: true, token });
};
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id).select('-password').populate('favHero');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
module.exports = {
  getUserInfo,
  createUser,
  loginUser,
  updateProfile,
  addCredits,
  deleteProfile,
};
