// File: controllers/generatingControllers/updateTestResult.js
const Test = require('../../models/Test');

const saveTestResults = async (req, res) => {
    const { score, timestamp, testType, topic } = req.body; // Ensure the request body includes these fields
    const userId = req.user.id; // User ID is retrieved from the authenticated user

    try {
        // Find the test document for the given user and criteria
        const existingTest = await Test.findOne({ userId, 'tests.testType': testType, 'tests.topic': topic });

        // Check if the test document exists
        if (!existingTest) {
            return res.status(404).json({ message: 'Test not found for the user' });
        }

        // Find the specific test entry within the found document
        const testEntry = existingTest.tests.find(test => test.testType === testType && test.topic === topic);

        // If the test entry exists, update its score and timestamp
        if (testEntry) {
            testEntry.score = score; // Update the score
            testEntry.timestamp = timestamp; // Update the timestamp

            await existingTest.save(); // Save the updated document back to the database

            res.json({ message: 'Test results updated successfully', data: existingTest });
        } else {
            res.status(404).json({ message: 'Test entry not found' });
        }
    } catch (error) {
        console.error('Error updating test results:', error.message);
        res.status(500).json({ message: 'Failed to update test results' });
    }
};

module.exports = { saveTestResults };
