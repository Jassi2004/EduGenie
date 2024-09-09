const express = require('express');
const fs = require('fs'); // Import the File System module
const path = require('path'); // Import the Path module to handle file paths
// const { jwtAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Define the route to send the JSON data
router.get('/get-test-data', (req, res) => {
    // Define the path to the JSON file
    const filePath = path.join(__dirname, '../output/generatedTest.json');
    
    // Read the JSON file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err.message);
            return res.status(500).json({ message: 'Failed to read test data' });
        }

        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);
            // Send the JSON data as a response
            res.json({ message: 'Test data retrieved successfully', data: jsonData });
        } catch (parseError) {
            console.error('Error parsing JSON file:', parseError.message);
            return res.status(500).json({ message: 'Failed to parse test data' });
        }
    });
});

module.exports = router;
