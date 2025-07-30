import mongoose from 'mongoose';
import { User } from '../models/index.js';

// Migration script to fix existing users without proper portfolio data
export const migrateUsers = async () => {
  try {
    console.log('Starting user migration...');
    
    // Find all users without proper portfolio data
    const usersToMigrate = await User.find({
      $or: [
        { portfolioData: { $exists: false } },
        { 'portfolioData.fullName': { $exists: false } }
      ]
    });
    
    console.log(`Found ${usersToMigrate.length} users to migrate`);
    
    for (const user of usersToMigrate) {
      console.log(`Migrating user: ${user.username} (${user.email})`);
      
      // Create default portfolio data
      const defaultPortfolioData = {
        fullName: user.username || 'User',
        bio: '',
        title: 'Developer',
        location: '',
        contactEmail: user.email,
        socialLinks: {},
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        isPublic: true,
        showAnalytics: false,
        // Preserve any existing portfolio data
        ...user.portfolioData
      };
      
      // Update user with proper portfolio data
      await User.findByIdAndUpdate(
        user._id,
        { 
          $set: { 
            portfolioData: defaultPortfolioData 
          } 
        },
        { new: true }
      );
      
      console.log(`✓ Migrated user: ${user.username}`);
    }
    
    console.log('User migration completed successfully');
    return { success: true, migratedCount: usersToMigrate.length };
  } catch (error) {
    console.error('Error during user migration:', error);
    return { success: false, error: error.message };
  }
};

// Function to test user credentials
export const testUserCredentials = async (req, res) => {
  try {
    const users = await User.find({}).select('username email role portfolioData createdAt');
    
    const userSummary = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      hasPortfolioData: !!user.portfolioData,
      hasFullName: !!(user.portfolioData && user.portfolioData.fullName),
      createdAt: user.createdAt
    }));
    
    res.json({
      message: 'User credentials test',
      totalUsers: users.length,
      users: userSummary
    });
  } catch (error) {
    console.error('Error testing user credentials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};