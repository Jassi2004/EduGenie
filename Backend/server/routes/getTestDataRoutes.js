const express = require('express');
const { jwtAuthMiddleware } = require('../middleware/auth'); // Ensure your auth middleware is correctly implemented
const getTestDataFunction = require('../controllers/generateTestController'); // Ensure correct import

const router = express.Router();

// Define the GET route to get test data
router.get('/get-test-data', getTestDataFunction);

module.exports = router;
