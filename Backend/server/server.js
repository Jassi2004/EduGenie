const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./config/mongoDbConnection")
const jwtAuthMiddleware = require('./middleware/auth')

dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads')); // This tells Express to serve files from the "uploads" directory

// Middleware
app.use(cors()); // Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow credentials such as cookies
}));

// Routes setup
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const generateNotesRoutes = require('./routes/generateNotesRoutes');
app.use('/api', generateNotesRoutes);

const generateTestRoutes = require('./routes/generateTestRoutes');
app.use('/api', generateTestRoutes);

const saveTestResults = require('./routes/saveTestRoutes');
app.use('/api', saveTestResults);

const publishNoteRoutes = require('./routes/publishNoteRoutes');
app.use('/api', publishNoteRoutes);

const validateRoute = require('./routes/validateRoute');
app.use('/api', validateRoute);

const getTestData = require('./routes/getTestDataFromJson');
app.use('/api', getTestData);

const getUserTests = require('./routes/getUserTestRoutes');
app.use('/api', getUserTests);

const testRoutes = require('./routes/getTestDetailRoute');
app.use('/api', testRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
