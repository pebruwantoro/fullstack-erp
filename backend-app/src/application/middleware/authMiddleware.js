import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized: No token provided' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized: Invalid token' 
        });
    }
};

const roleMiddleware = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ 
            success: false,
            message: 'Forbidden: You do not have the required role' 
        });
    }
    next();
};

const customerMiddleware = roleMiddleware([UserRole.CUSTOMER]);

const salesMiddleware = roleMiddleware([UserRole.SALES]);

export { authMiddleware, customerMiddleware, salesMiddleware }