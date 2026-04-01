import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    // List of public routes to bypass verification
    const publicRoutes = ['/login', '/signup'];
    
    // Check if current route is in the publicRoutes list
    // req.path or req.url depending on how it's used
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
