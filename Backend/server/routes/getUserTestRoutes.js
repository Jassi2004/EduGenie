const express = require('express');
const router = express.Router();
const  {getUserFunction} = require('../controllers/generatingControllers/getUserTestController');
const { jwtAuthMiddleware } = require('../middleware/auth');

router.get('/get-user-tests',jwtAuthMiddleware , getUserFunction);

module.exports = router;