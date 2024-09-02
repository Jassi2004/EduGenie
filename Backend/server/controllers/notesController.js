// controllers/notesController.js
const Note = require("../models/Note"); // Import the Note model

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
        // Save the note data in the database
        const newNote = new Note({
            user: userId, // Ensure this field gets the correct user ID
            topic,
            timeSetting: timeSettingOptions[timeSetting],
            complexity: complexityOptions[complexity]
        });

        await newNote.save();

        res.json({ message: 'Notes generated and saved successfully', data: newNote });
    } catch (error) {
        console.error('Error saving notes:', error);
        res.status(500).json({ message: 'Failed to save notes', error: error.message });
    }
};


module.exports = { generateNotes }
