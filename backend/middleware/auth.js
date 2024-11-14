const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        // Log the headers to debug
        console.log('Request headers:', req.headers);
        
        const authHeader = req.headers['authorization'];
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        console.log('Extracted token:', token);

        if (!token) {
            return res.status(401).json({ message: 'Access denied. Invalid token format.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(403).json({ message: 'Invalid token.', error: error.message });
    }
};

module.exports = authenticateToken;
