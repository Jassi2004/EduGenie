const publishNote = require("../models/publishNote");

const publishNoteFunction = async (req, res) => {
    const { topic, description, hashtags } = req.body;
    const pdfFile = req.file;

    try {
        // Convert hashtags to an array by splitting by commas
        const hashtagsArray = hashtags.split(',').map(tag => tag.trim());

        // Create a new Note document
        const newNote = new publishNote({
            topic,
            description,
            hashtags: hashtagsArray,
            pdfFilePath: pdfFile.path, // Save the path of the uploaded PDF file
        });

        // Save the Note document to the database
        await newNote.save();

        res.json({ message: 'Notes published successfully!', note: newNote });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Failed to publish notes. Please try again.' });
    }
};

// Correct way to export
module.exports = publishNoteFunction;
