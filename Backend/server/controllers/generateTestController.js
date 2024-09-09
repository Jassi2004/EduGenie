const fs = require('fs');
const path = require('path');

const getTestDataFunction = async (req, res) => {
    // Construct the path to the generatedTest.json file
    const filePath = path.join(__dirname, '..', 'output', 'generatedTest.json');
  
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading test data:', err);
        return res.status(500).json({ message: 'Failed to read test data' });
      }
  
      try {
        // Parse the JSON data
        const testData = JSON.parse(data);
        // Send the JSON data as the response
        res.json({ testData });
      } catch (parseError) {
        console.error('Error parsing test data:', parseError);
        res.status(500).json({ message: 'Failed to parse test data' });
      }
    });
};

module.exports = getTestDataFunction;
