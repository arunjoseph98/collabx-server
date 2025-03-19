const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Add user
exports.registerController = async (req, res) => {
  console.log("Inside register controller");

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// user login
exports.loginController = async (req, res) => {
  console.log("Inside loginController");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      groups: user.groups,
    };

    res
      .status(200)
      .json({ message: "Login successful", user: userResponse, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//profile updation
exports.editUserinfoController = async (req, res) => {
  console.log("inside editUserController");
  const userId = req.userId;
  const { username, email, profilePic } = req.body;
  const uploadedProfilePic = req.file ? req.file.filename : profilePic;

  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      { username, email, profilePic: uploadedProfilePic },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      profilePic: updateUser.profilePic,
      groups: updateUser.groups,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//change-password
exports.changePasswordController = async (req, res) => {
  console.log("Inside changePasswordController");
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password with stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getAllUsers
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
