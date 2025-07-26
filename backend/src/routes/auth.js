import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Function to get JWT secret with validation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET or ACCESS_TOKEN_SECRET environment variable is required');
  }
  return secret;
};

// Register route (for initial admin setup)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      getJWTSecret(),
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      getJWTSecret(),
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Get current user route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route (client-side token removal)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Verify token route
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Create admin user route (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password, adminKey } = req.body;
    
    // Simple admin key check (you should change this in production)
    const expectedAdminKey = process.env.ADMIN_SETUP_KEY || 'admin-setup-2024';
    if (adminKey !== expectedAdminKey) {
      return res.status(403).json({ message: 'Invalid admin setup key' });
    }
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: adminUser._id, username: adminUser.username, role: adminUser.role },
      getJWTSecret(),
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );

    res.status(201).json({
      message: 'Admin user created successfully',
      token,
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Internal server error during admin creation' });
  }
});

// Temporary route to create a second admin for testing (remove in production)
router.post('/create-test-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if this specific user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: adminUser._id, username: adminUser.username, role: adminUser.role },
      getJWTSecret(),
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );

    res.status(201).json({
      message: 'Test admin user created successfully',
      token,
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Create test admin error:', error);
    res.status(500).json({ message: 'Internal server error during test admin creation' });
  }
});

// Update user to admin route (for upgrading existing users)
router.put('/make-admin/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.json({
      message: 'User upgraded to admin successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password route
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Temporary password reset route (remove in production)
router.post('/reset-admin-password', async (req, res) => {
  try {
    const { newPassword, adminKey } = req.body;
    
    // Simple admin key check for security
    const expectedAdminKey = process.env.ADMIN_SETUP_KEY || 'admin-setup-2024';
    if (adminKey !== expectedAdminKey) {
      return res.status(403).json({ message: 'Invalid admin setup key' });
    }
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Find the admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    adminUser.password = hashedPassword;
    await adminUser.save();

    res.json({ 
      message: 'Admin password reset successfully',
      username: adminUser.username,
      email: adminUser.email
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error during password reset' });
  }
});

export default router;