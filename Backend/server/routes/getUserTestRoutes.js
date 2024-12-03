const express = require('express');
const router = express.Router();
const { getUserFunction, getUserNotes } = require('../controllers/generatingControllers/getUserTestController');
const { jwtAuthMiddleware } = require('../middleware/auth');

router.get('/get-user-tests', jwtAuthMiddleware, getUserFunction);
router.get('/get-user-notes', jwtAuthMiddleware, getUserNotes);

module.exports = router;