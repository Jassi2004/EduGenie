const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/mainSettingControllers/registerController');
const { jwtAuthMiddleware } = require('../middleware/auth');
const { loginUser } = require('../controllers/mainSettingControllers/loginController');
const { dashboardFunction } = require('../controllers/mainSettingControllers/dashboardController');
const upload = require('../middleware/uplaodMiddleware'); // Import the updated upload middleware

// Register a new user
router.post('/register', registerUser);     // ok tested

// Login a user
router.post('/login' , loginUser);          // ok tested

// dashboard
router.get('/dashboard', dashboardFunction);// ok tested

// get a particular user from the token
router.get('/get-user-from-token' , jwtAuthMiddleware , async (req, res)=>{ // ok tested
    res.status(200).json({user: req.user});
})

module.exports = router;
 