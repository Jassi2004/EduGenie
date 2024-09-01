const express = require('express');
const upload = require('../middleware/uplaodMiddleware'); // Make sure you have a middleware for file upload
const publishNoteFunction = require('../controllers/publishNoteController');
const { jwtAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Define the POST route with the file upload middleware
router.post('/publish-notes', jwtAuthMiddleware , upload.single('pdfFile'), publishNoteFunction);

module.exports = router;
