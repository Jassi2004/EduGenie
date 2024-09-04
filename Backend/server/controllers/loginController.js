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

    // Check if stored hashed password is valid
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch: ", isMatch);
    
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ error: "Invalid password for this email" });
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      // avatar: user.avatar
    };

    const token = generateToken(payload);
    res.json({ token: token, user: payload });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { loginUser };
