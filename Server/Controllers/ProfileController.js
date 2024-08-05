const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new user
const createUser = async (req, res) => {
  try {
   const { username, email, password } = req.body;
  
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err});
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

// Update user profile image
const updateUserProfileImage = async (req, res) => {
  const { profileImage } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.userId, { profileImage }, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Update user username
const updateUsername = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.currentUser._id, { username }, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Add credits to user
const addCredits = async (req, res) => {
  const { credits } = req.body;
  try {
    const user = await User.findById(req.userId);
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

module.exports = {
  createUser,
  loginUser,
  updateUserProfileImage,
  updateUsername,
  addCredits,
};
