const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ error: "Invalid email" });
    }

    // Log the entered password and the stored hashed password
    console.log(`Password entered: ${password}`);
    console.log(`Stored hashed password: ${user.password}`);
    bcrypt.compare(password, user.password)
  .then(console.log); // Should output: true

    
    // Check if stored hashed password is valid
    if (!user.password) {
      console.log("No password found for user:", email);
      return res.status(401).json({ error: "Invalid password for this email" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ error: "Invalid password for this email" });
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username
    };


    const token = generateToken(payload);
    res.json({ token: token , GeneratedPayload: payload});
    
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginUser };
