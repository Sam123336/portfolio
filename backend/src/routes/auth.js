import express from 'express';
import { 
  registerAdmin, 
  registerUser, 
  loginUser, 
  getPortfolioByUsername, 
  getDefaultPortfolio, 
  updatePortfolioData 
} from '../controllers/authController.js';
import { migrateUsers, testUserCredentials } from '../controllers/migrationController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Multi-portfolio routes
router.post('/admin/register', registerAdmin); // New admin registration with portfolio setup
router.post('/login', loginUser); // Enhanced login with portfolio URL
router.get('/portfolio/default', getDefaultPortfolio); // Get default portfolio (yours)
router.get('/portfolio/:username', getPortfolioByUsername); // Get portfolio by username
router.put('/portfolio/update', authMiddleware, updatePortfolioData); // Update portfolio data

// Legacy routes (kept for backward compatibility)
router.post('/register', registerUser); // Original registration

// Debug and migration routes (admin only)
router.get('/debug/users', adminMiddleware, testUserCredentials); // Test user credentials
router.post('/migrate/users', adminMiddleware, async (req, res) => {
  try {
    const result = await migrateUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { User } = await import('../models/index.js');
    const user = await User.findById(req.user.userId || req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        portfolioData: user.portfolioData
      },
      portfolioUrl: `${req.protocol}://${req.get('host')}/${user.username}`
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Verify token route
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const { User } = await import('../models/index.js');
    const user = await User.findById(req.user.userId || req.user.id).select('-password');
    
    res.json({ 
      valid: true, 
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        portfolioData: user.portfolioData
      },
      portfolioUrl: `${req.protocol}://${req.get('host')}/${user.username}`
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all public portfolios (for discovery)
router.get('/portfolios/public', async (req, res) => {
  try {
    const { User } = await import('../models/index.js');
    const publicPortfolios = await User.find({ 
      'portfolioData.isPublic': true 
    }).select('-password -email').sort({ createdAt: -1 });
    
    res.json({
      portfolios: publicPortfolios.map(user => ({
        username: user.username,
        portfolioData: {
          fullName: user.portfolioData.fullName,
          title: user.portfolioData.title,
          bio: user.portfolioData.bio,
          location: user.portfolioData.location,
          profilePicture: user.portfolioData.profilePicture,
          theme: user.portfolioData.theme
        },
        createdAt: user.createdAt,
        portfolioUrl: `${req.protocol}://${req.get('host')}/${user.username}`
      }))
    });
  } catch (error) {
    console.error('Get public portfolios error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Set default user (admin only)
router.put('/set-default/:username', authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const { User } = await import('../models/index.js');
    
    // Check if current user is admin
    const currentUser = await User.findById(req.user.userId || req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Remove default flag from all users
    await User.updateMany({}, { isDefaultUser: false });
    
    // Set new default user
    const newDefaultUser = await User.findOneAndUpdate(
      { username },
      { isDefaultUser: true },
      { new: true }
    ).select('-password');
    
    if (!newDefaultUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: `${username} is now the default portfolio`,
      defaultUser: {
        username: newDefaultUser.username,
        portfolioData: newDefaultUser.portfolioData
      }
    });
  } catch (error) {
    console.error('Set default user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;