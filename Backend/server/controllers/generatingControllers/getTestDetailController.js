// controllers/TestController.js
const Test = require('../../models/Test'); // Ensure the path is correct

const getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params; // Extract test ID from the route parameters

    // Fetch the test by ID
    const test = await Test.findOne({ 'tests._id': testId });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Extract the test details from the test document
    const testDetails = test.tests.id(testId);

    res.status(200).json({ test: testDetails });
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTestDetails };
