const publishNote = require("../../models/publishNote");
const User = require("../../models/user"); // Import the User model

const publishNoteFunction = async (req, res) => {
    const { topic, description, hashtags } = req.body;
    const pdfFile = req.file;

    try {
        if (!pdfFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert hashtags to an array
        const hashtagsArray = hashtags
            ? hashtags.split(',').map(tag => tag.trim()) // Split by comma and trim whitespace
            : [];

        // Create a new Note document and link it to the user
        const newNote = new publishNote({
            topic,
            description,
            hashtags: hashtagsArray,
            pdfFilePath: pdfFile.path, // Save the path of the uploaded PDF file
            userId: req.user.id, // Link the note to the logged-in user
        });

        // Save the Note document to the database
        await newNote.save();

        // Add this note reference to the user's publishedNotes array
        await User.findByIdAndUpdate(req.user.id, {
            $push: { publishedNotes: newNote._id },
        });

        res.status(201).json({
            message: 'Notes published successfully!',
            noteDetails: newNote,
        });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Failed to publish notes. Please try again.' });
    }
};

const getPublishedNotes = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request after JWT authentication

    try {
        // Retrieve all notes published by the user
        const notes = await publishNote.find({ userId }).select('topic description hashtags pdfFilePath createdAt'); // You can select specific fields as needed

        if (!notes) {
            return res.status(404).json({ message: "No notes found for this user." });
        }

        res.status(200).json(notes); // Send the notes data back to the frontend
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

// Endpoint to get all published notes with publisher info
const getAllPublishedNotes = async (req, res) => {
    try {
        const notes = await publishNote.find()
            .populate('userId', 'username') // Populate with the username of the user
            .sort({ createdAt: -1 }); // Sort by date (latest first)
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notes');
    }
};


// Get all published notes
exports.getAllPublishedNotes = async (req, res) => {
    try {
        const notes = await PublishNote.find().populate('userId', 'username'); // Include user details
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

// Like a note
const likeNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await publishNote.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.likeCount += 1;
        await note.save();

        res.status(200).json({ likeCount: note.likeCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like the note' });
    }
};

// Dislike a note
const dislikeNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await publishNote.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.likeCount > 0) {
            note.likeCount -= 1;
        }

        await note.save();

        res.status(200).json({ likeCount: note.likeCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to dislike the note' });
    }
};


module.exports = {
    getPublishedNotes,
    publishNoteFunction, // keep the previous publishNote function
    getAllPublishedNotes,
    likeNote,
    dislikeNote
};
