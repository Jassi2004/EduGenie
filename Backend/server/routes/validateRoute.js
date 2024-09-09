const express = require('express');
const {validateTokenController} = require('../controllers/mainSettingControllers/validateTokenController')
const { jwtAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Define the POST route with the file upload middleware
router.get('/validate-token', jwtAuthMiddleware , validateTokenController);

module.exports = router;
