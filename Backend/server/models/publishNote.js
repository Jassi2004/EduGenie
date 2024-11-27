const mongoose = require('mongoose');

// Publish Note schema definition
const publishNoteSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hashtags: {
        type: [String], // Array of strings to store multiple hashtags
        required: false,
    },
    pdfFilePath: {
        type: String,
        required: true, // Storing the file path of the uploaded PDF
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
        required: true, // Make sure every note is associated with a user
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likedByUser: {
        type: Boolean,
        default: false
    }, // Store whether the user liked this note

});

module.exports = mongoose.model('publishNote', publishNoteSchema);
