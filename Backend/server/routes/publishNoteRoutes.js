const express = require('express');
const upload = require('../middleware/uplaodMiddleware'); // Correct path
const { publishNoteFunction, getPublishedNotes, getAllPublishedNotes, likeNote, dislikeNote } = require('../controllers/generatingControllers/publishNoteController');
const { jwtAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Define the POST route with the file upload middleware
router.post('/publish-notes', jwtAuthMiddleware, upload.single('pdfFile'), publishNoteFunction);


// Route for getting published notes (GET)
router.get('/published-notes', jwtAuthMiddleware, getPublishedNotes);


// Route for getting published notes (GET)
router.get('/get-all-published-notes', jwtAuthMiddleware, getAllPublishedNotes);

// Like a note
router.post('/:noteId/like', jwtAuthMiddleware, likeNote);

// Dislike a note
router.post('/:noteId/dislike', jwtAuthMiddleware, dislikeNote);

module.exports = router;
