const publishNote = require("../models/publishNote");

const publishNoteFunction = async (req, res) => {
    const { topic, description, hashtags } = req.body;
    const pdfFile = req.file;

    try {
        if (!pdfFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert hashtags to an array
        const hashtagsArray = hashtags ? hashtags.split(',').map(tag => tag.trim()) : [];

        // Create a new Note document
        const newNote = new publishNote({
            topic,
            description,
            hashtags: hashtagsArray,
            pdfFilePath: pdfFile.path, // Save the path of the uploaded PDF file
        });

        // Save the Note document to the database
        await newNote.save();

        

        res.json({ message: 'Notes published successfully!', noteDetails: newNote });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Failed to publish notes. Please try again.' });
    }
};

module.exports = publishNoteFunction;
