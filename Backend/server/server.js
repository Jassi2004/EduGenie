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

// Middleware
app.use(cors()); // Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow credentials such as cookies
}));

// ROUTES
const userRoutes = require('./routes/userRoutes');
const generateNotesRoutes = require('./routes/generateNotesRoutes')
const generateTestRoutes = require('./routes/generateTestRoutes');
const publishNoteRoutes = require('./routes/publishNoteRoutes');
const validateRoute = require('./routes/validateRoute');
const GeminiRoutes = require('./routes/GeminiRoutes');
app.use('/api', userRoutes);            // ok tested backend
app.use('/api', generateNotesRoutes);   // ok tested backend
app.use('/api', generateTestRoutes);    // ok tested backend
app.use('/api', validateRoute) 
app.use('/api', publishNoteRoutes);
app.use('/api', GeminiRoutes);

// app.get('/', jwtAuthMiddleware ,(req, res) => {
//     res.json({ message: `Welcome to the dashboard using link / , ${req.user.id}!` });
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
