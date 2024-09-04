const express = require('express');
const router = express.Router();
const { generateNotes } = require('../controllers/notesController');
const { jwtAuthMiddleware } = require('../middleware/auth');

router.post('/generate-notes', jwtAuthMiddleware, generateNotes);
 
module.exports = router;