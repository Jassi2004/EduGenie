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

// // Middleware
app.use(cors()); // Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow credentials such as cookies
}));

// // ROUTES

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);            // ok tested backend

const generateNotesRoutes = require('./routes/generateNotesRoutes')
app.use('/api', generateNotesRoutes);   // ok tested backend

const generateTestRoutes = require('./routes/generateTestRoutes');
app.use('/api', generateTestRoutes);    // ok tested backend

const saveTestResults = require('./routes/saveTestRoutes')
app.use('/api', saveTestResults);
 
const publishNoteRoutes = require('./routes/publishNoteRoutes');
app.use('/api', publishNoteRoutes);

const validateRoute = require('./routes/validateRoute');
app.use('/api', validateRoute) 

const getTestData = require('./routes/getTestDataFromJson');
app.use('/api', getTestData);


// const GeminiRoutes = require('./routes/GeminiRoutes');
// app.use('/api', GeminiRoutes);






// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
