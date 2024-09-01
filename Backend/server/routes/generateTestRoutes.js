const express = require('express');
const { generateTest } = require('../controllers/testController');
const { jwtAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply jwtAuthMiddleware to protect this route
router.post('/generate-test', jwtAuthMiddleware, generateTest);

module.exports = router;