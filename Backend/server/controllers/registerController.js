const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");
const express = require("express");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate the input fields
    if (!username) return res.status(400).json({ error: "Please enter a username" });
    if (!email) return res.status(400).json({ error: "Please enter an email" });
    if (!password) return res.status(400).json({ error: "Please enter a password" });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    const saltRounds = 10; // Define salt rounds for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create a new user object with the hashed password
    const newUser = new User({ username, email, hashedPassword: hashedPassword , password: password});

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const payload = {
      id: savedUser.id,
      email: savedUser.email,
    };

    const token = generateToken(payload);

    // Respond with the new user and token
    res.status(201).json({ user: savedUser, token: token });

  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser };
