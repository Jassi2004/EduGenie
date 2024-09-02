const express = require('express');
const { jwtAuthMiddleware } = require('../middleware/auth');
const {validateTokenController} = require('../controllers/validateTokenController')

const router = express.Router();

// Apply jwtAuthMiddleware to protect this route
router.get('/validate-token', jwtAuthMiddleware,  validateTokenController);

module.exports = router;