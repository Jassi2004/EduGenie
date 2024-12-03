const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/mainSettingControllers/registerController');
const { jwtAuthMiddleware } = require('../middleware/auth');
const { loginUser } = require('../controllers/mainSettingControllers/loginController');
const { dashboardFunction } = require('../controllers/mainSettingControllers/dashboardController');
const upload = require('../middleware/uplaodMiddleware'); // Import the updated upload middleware
const User = require('../models/user');

// Register a new user
router.post('/register', registerUser);     // ok tested

// Login a user
router.post('/login', loginUser);          // ok tested

// dashboard
router.get('/dashboard', dashboardFunction);// ok tested

// get a particular user from the token
router.get('/get-user-from-token', jwtAuthMiddleware, async (req, res) => { // ok tested
    res.status(200).json({ user: req.user });
})


router.get('/get-user-details', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming `req.user` is populated by jwtAuthMiddleware
    try {
        // Fetch the user details by ID
        const user = await User.findById(userId).select('-password'); // Exclude sensitive data like password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // Send the user data back to the frontend
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


router.patch('/decrement-generation', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming `req.user` is populated by jwtAuthMiddleware
    try {
        // Find the user and decrement generationsLeft
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.generationsLeft <= 0) {
            return res.status(400).json({ message: "No generations left" });
        }

        // Decrement the generationsLeft field
        user.generationsLeft -= 1;
        await user.save();

        res.status(200).json({ message: "Generation decremented", generationsLeft: user.generationsLeft });
    } catch (error) {
        console.error("Error decrementing generations:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch user details API
const getUserDetails = async (req, res) => {
    const user = await User.findById(req.user.id); // Assuming user is authenticated and userId is available in req.user
    if (!user) return res.status(404).send("User not found");

    // Calculate the remaining days if the plan is weekly
    let remainingDays = null;
    if (user.planType === 'weekly' && user.planExpiryDate) {
        remainingDays = Math.ceil((user.planExpiryDate - new Date()) / (1000 * 60 * 60 * 24)); // Days left in the weekly plan
    }

    res.json({
        planType: user.planType,
        isPremium: user.isPremium,
        remainingDays: remainingDays,
    });
};


module.exports = router;
