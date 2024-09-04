const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');
const { jwtAuthMiddleware } = require('../middleware/auth');
const { loginUser } = require('../controllers/loginController');
const { dashboardFunction } = require('../controllers/dashboardController');
const upload = require('../middleware/uplaodMiddleware'); // Import the updated upload middleware

// Register a new user
router.post('/register', registerUser);
// router.post('/register', upload.single('avatar'), registerUser);

// Login a user
router.post('/login' , loginUser);

// dashboard
router.get('/dashboard', dashboardFunction);

// get a particular user from the token
router.get('/get-user-from-token' , jwtAuthMiddleware , async (req, res)=>{
    res.status(200).json({user: req.user});
})

module.exports = router;
 