// controllers/notesController.js
const Note = require("../models/Note"); // Import the Note model
const { geminiFunction } = require('./GeminiController');

const generateNotes = async (req, res) => { 
    const { topic, timeSetting, complexity } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and you have user ID available

    const timeSettingOptions = ['3 hours', '1 day', '1 week', 'Detailed plan'];
    const complexityOptions = ['Baby', 'Beginner', 'Intermediate', 'Advanced'];

    console.log('-------------------------------', '\n');
    console.log('log statements from generateNotes');
    console.log('Received topic:', topic);
    console.log('Received time setting:', timeSetting);
    console.log('Received complexity:', complexity);
    console.log('User ID:', userId); // Check that this is not undefined
    console.log('req.user: ', req.user);
    console.log('-------------------------------');


    try {
        // Call the function to generate notes
        const generatedContent = await geminiFunction({
          topic: topic,
          time: timeSettingOptions[timeSetting],
          complexity: complexityOptions[complexity],
        });
    
        const newNote = new Note({
          user: userId,
          topic: topic,
          timeSetting: timeSettingOptions[timeSetting],
          complexity: complexityOptions[complexity],
          content: generatedContent, // Save the generated notes content correctly
        });
    
        await newNote.save();
    
        // Include content in the response
        res.json({ 
          message: 'Notes generated and saved successfully', 
          data: {
            ...newNote._doc, // Spread the document to retain existing fields
            content: generatedContent // Ensure content is included
          }
        });
      } catch (error) {
        console.error('Error saving notes:', error);
        res.status(500).json({ message: 'Failed to save notes', error: error.message });
      }
};

module.exports = { generateNotes };
