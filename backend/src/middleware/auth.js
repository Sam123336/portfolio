import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Function to get JWT secret with validation
const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
  
  if (!JWT_SECRET) {
    console.error('CRITICAL ERROR: No JWT_SECRET or ACCESS_TOKEN_SECRET found in environment variables!');
    throw new Error('JWT secret not configured');
  }
  
  return JWT_SECRET;
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, getJWTSecret());
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const adminMiddleware = async (req, res, next) => {
    // First check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, getJWTSecret());
        req.user = decoded;
        
        // Fetch current user role from database to ensure it's up to date
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found.' });
        }
        
        // Check if JWT role is outdated compared to database role
        if (decoded.role !== currentUser.role) {
            console.log(`Role mismatch detected for user ${currentUser.email}:`);
            console.log(`  JWT token role: ${decoded.role}`);
            console.log(`  Current database role: ${currentUser.role}`);
            console.log('  User needs to log in again to refresh token with updated role.');
            
            return res.status(401).json({ 
                message: 'Your permissions have been updated. Please log in again to refresh your access.',
                code: 'ROLE_UPDATED'
            });
        }
        
        // Update req.user with current role from database (should be same as JWT now)
        req.user.role = currentUser.role;
        
        // Then check if user is admin
        if (currentUser.role === 'admin') {
            next();
        } else {
            console.log('Access denied - not admin role. Current role:', currentUser.role);
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Admin middleware token verification error:', error.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Alias for consistency with other parts of the codebase
const authenticateToken = authMiddleware;

export { authMiddleware, adminMiddleware, authenticateToken };
