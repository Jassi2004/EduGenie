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

// CORS Setup
const corsOptions = {
    origin: [
        'http://localhost:5173', // Development
        'https://edu-genie-theta.vercel.app', // Production
        'https://edu-genie-jaskirat-singhs-projects-211a0a66.vercel.app',
        'https://edu-genie-git-main-jaskirat-singhs-projects-211a0a66.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    credentials: true, // Allow credentials such as cookies
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight requests


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://edu-genie-theta.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});



const Razorpay = require('razorpay');

// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
    // Replace with your key_id
    key_id: process.env.key_id,

    // Replace with your key_secret
    key_secret: process.env.key_secret
});


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

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api', paymentRoutes);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
