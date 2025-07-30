import { CV } from '../models/index.js';
import { deleteImage } from '../utils/cloudinary.js';

// Get active CV PDF
export const getCV = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cv;
    if (userId) {
      // Get CV for specific user
      cv = await CV.findOne({ userId, isActive: true })
        .populate('userId', 'portfolioData.fullName username')
        .sort({ createdAt: -1 });
    } else {
      // Get default CV (for main portfolio)
      const { User } = await import('../models/index.js');
      const defaultUser = await User.findOne({ isDefaultUser: true });
      if (defaultUser) {
        cv = await CV.findOne({ userId: defaultUser._id, isActive: true })
          .populate('userId', 'portfolioData.fullName username')
          .sort({ createdAt: -1 });
      }
    }
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    res.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload new CV PDF (Admin only)
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { title, description } = req.body;
    const userId = req.user.userId || req.user.id;

    // Deactivate previous CV
    await CV.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    // Create new CV record
    const cv = new CV({
      filename: req.file.filename || req.file.public_id,
      originalName: req.file.originalname,
      url: req.file.path,
      publicId: req.file.filename || req.file.public_id,
      fileSize: req.file.size,
      title: title || 'CV',
      description: description || '',
      userId,
      isActive: true
    });

    await cv.save();

    res.status(201).json({
      message: 'CV uploaded successfully',
      cv
    });

  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete CV (Admin only)
export const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const cv = await CV.findOne({ _id: id, userId });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Delete from Cloudinary
    if (cv.publicId) {
      try {
        await deleteImage(cv.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await CV.findByIdAndDelete(id);

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all CV versions (Admin only)
export const getAllCVs = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const cvs = await CV.find({ userId })
      .populate('userId', 'portfolioData.fullName username')
      .sort({ createdAt: -1 });

    res.json(cvs);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set active CV (Admin only)
export const setActiveCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // Check if CV exists and belongs to user
    const cv = await CV.findOne({ _id: id, userId });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Deactivate all CVs for this user
    await CV.updateMany({ userId }, { isActive: false });

    // Activate the selected CV
    await CV.findByIdAndUpdate(id, { isActive: true });

    res.json({ message: 'CV set as active successfully' });
  } catch (error) {
    console.error('Error setting active CV:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};