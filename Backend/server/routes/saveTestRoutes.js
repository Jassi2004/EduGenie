const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../middleware/auth');
const { saveTestResults } = require('../controllers/generatingControllers/updateTestResult');

router.patch('/save-test-results', jwtAuthMiddleware, saveTestResults); // ok tested

module.exports = router; 