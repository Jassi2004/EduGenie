// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { getTestDetails } = require('../controllers/generatingControllers/getTestDetailController');

// Route to get details of a specific test
router.get('/test-details/:testId', getTestDetails);

module.exports = router;