const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('publishNote', publishNoteSchema);
