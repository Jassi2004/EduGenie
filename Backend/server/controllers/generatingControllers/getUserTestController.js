// controllers/UserController.js
const Test = require('../../models/Test'); // Ensure the path is correct

const getUserFunction = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user from middleware
    console.log("userId: ", userId);
    
    const tests = await Test.find({ userId }).sort({ createdAt: -1 });
    console.log("tests: ", tests);
    
    res.status(200).json({ tests });
  } catch (error) {
    console.error('Error fetching user tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserFunction };
