const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {
    console.log('-------------------------------');
    console.log('Log statements from jwtAuthMiddleware' , '\n');
    const authorizationHeader = req.headers.authorization;
    console.log("Authorization Header:", authorizationHeader);
    
    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    
    const token = authorizationHeader.split(' ')[1]; // Assumes format is 'Bearer <token>'
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token payload (user data) to the request object
        
        console.log('Decoded user:', decoded);
        console.log('-------------------------------');
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        console.log('-------------------------------');
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const generateToken = (userData) => {
    console.log('-------------------------------');
    console.log('Log statements from generateToken' , '\n');
    console.log('User data for token generation:', userData); // Debug log for userData
    
    // Access `userData.id` since it appears the `_id` is not being used
    const payload = {
        id: userData.id.toString(), // Convert ObjectId to string
        email: userData.email,
        username: userData.username,
    };
    
    console.log('Payload: ', payload);
    
    
    console.log('-------------------------------'); // Debug log for userData
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};



module.exports = { jwtAuthMiddleware, generateToken };   