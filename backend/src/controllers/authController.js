import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Register a new admin user with portfolio setup
export const registerAdmin = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      portfolioData 
    } = req.body;
    
    // Validate required portfolio data
    if (!portfolioData || !portfolioData.fullName) {
      return res.status(400).json({ 
        message: 'Full name is required for portfolio setup' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user with portfolio data
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      portfolioData: {
        fullName: portfolioData.fullName,
        bio: portfolioData.bio || '',
        title: portfolioData.title || 'Full-Stack Developer',
        location: portfolioData.location || '',
        contactEmail: portfolioData.contactEmail || email,
        socialLinks: portfolioData.socialLinks || {},
        theme: {
          primaryColor: portfolioData.theme?.primaryColor || '#3b82f6',
          secondaryColor: portfolioData.theme?.secondaryColor || '#8b5cf6',
          backgroundColor: portfolioData.theme?.backgroundColor || '#ffffff',
          textColor: portfolioData.theme?.textColor || '#1f2937'
        },
        isPublic: portfolioData.isPublic !== undefined ? portfolioData.isPublic : true,
        showAnalytics: portfolioData.showAnalytics || false
      }
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
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
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Original register function (kept for backward compatibility)
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      portfolioData: {
        fullName: username, // Default to username
        title: 'Developer'
      }
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user - Enhanced to support both email and username
export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Support login with either email or username
    const loginField = email || username;
    if (!loginField) {
      return res.status(400).json({ message: 'Email or username is required' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    console.log('Login attempt with:', { loginField, email, username });
    
    // Find user by email or username
    const user = await User.findOne({ 
      $or: [
        { email: loginField },
        { username: loginField }
      ]
    });
    
    console.log('User found:', user ? { id: user._id, username: user.username, email: user.email } : 'No user found');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials - user not found' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials - wrong password' });
    }
    
    // Ensure user has required portfolio data - migrate old users
    if (!user.portfolioData || !user.portfolioData.fullName) {
      console.log('Migrating user portfolio data for:', user.username);
      
      // Create proper default portfolio data with correct object structures
      const defaultPortfolioData = {
        fullName: user.username || 'User',
        bio: '',
        title: 'Developer',
        location: '',
        contactEmail: user.email,
        profilePicture: {
          url: '',
          publicId: ''
        },
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          website: ''
        },
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        isPublic: true,
        showAnalytics: false
      };
      
      // Merge with existing portfolio data if any exists
      if (user.portfolioData) {
        // Preserve existing data but ensure required fields are set
        user.portfolioData = {
          ...defaultPortfolioData,
          ...user.portfolioData,
          // Ensure these nested objects are properly structured
          profilePicture: user.portfolioData.profilePicture || defaultPortfolioData.profilePicture,
          socialLinks: user.portfolioData.socialLinks || defaultPortfolioData.socialLinks,
          theme: user.portfolioData.theme || defaultPortfolioData.theme
        };
      } else {
        user.portfolioData = defaultPortfolioData;
      }
      
      try {
        await user.save();
        console.log('✓ Successfully migrated user portfolio data for:', user.username);
      } catch (migrationError) {
        console.error('Migration error for user:', user.username, migrationError);
        // If migration fails, continue with login but user might need to update profile later
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
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
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get portfolio by username
export const getPortfolioByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    if (!user.portfolioData.isPublic) {
      return res.status(403).json({ message: 'This portfolio is private' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        portfolioData: user.portfolioData,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting portfolio:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get default portfolio (your portfolio)
export const getDefaultPortfolio = async (req, res) => {
  try {
    // Find the default user or fall back to first user
    let defaultUser = await User.findOne({ isDefaultUser: true }).select('-password');
    
    if (!defaultUser) {
      // If no default user is set, you can set one manually or use the first admin
      defaultUser = await User.findOne({ role: 'admin' }).select('-password').sort({ createdAt: 1 });
    }
    
    if (!defaultUser) {
      return res.status(404).json({ message: 'No default portfolio found' });
    }
    
    res.json({
      user: {
        id: defaultUser._id,
        username: defaultUser.username,
        portfolioData: defaultUser.portfolioData,
        createdAt: defaultUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting default portfolio:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update portfolio data
export const updatePortfolioData = async (req, res) => {
  try {
    const { portfolioData } = req.body;
    const userId = req.user.userId; // From auth middleware
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          'portfolioData': {
            ...portfolioData,
            // Preserve certain fields that shouldn't be overwritten
            isPublic: portfolioData.isPublic !== undefined ? portfolioData.isPublic : true,
            showAnalytics: portfolioData.showAnalytics !== undefined ? portfolioData.showAnalytics : false
          }
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Portfolio data updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        portfolioData: user.portfolioData
      }
    });
  } catch (error) {
    console.error('Error updating portfolio data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};