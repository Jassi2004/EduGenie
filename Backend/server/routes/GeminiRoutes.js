const express = require('express');
const router = express.Router();
// const { jwtAuthMiddleware } = require('../middleware/auth');
// const { GeminiFunction } = require('../controllers/GeminiController');
// const { generateNotes } = require('../controllers/notesController');
const  {geminiFunction} = require('../controllers/GeminiController')

router.post('/generate-gemini-notes',geminiFunction);

module.exports = router;