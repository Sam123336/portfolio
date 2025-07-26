import express from 'express';
const router = express.Router();
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary, deleteImage } from '../utils/cloudinary.js';
import { Image } from '../models/index.js';
import { adminMiddleware } from '../middleware/auth.js';

// Gallery Images Storage Configuration
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-gallery',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto' }
    ]
  },
});

// Project Images Storage Configuration
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  },
});

// Profile Picture Storage Configuration
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-profile',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ]
  },
});

const galleryUpload = multer({ 
  storage: galleryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const projectUpload = multer({ 
  storage: projectStorage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

const profileUpload = multer({ 
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Gallery Image Upload Route (Admin only)
router.post('/upload/gallery', adminMiddleware, galleryUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', error: 'req.file is undefined' });
    }
    
    console.log('Uploaded file object:', req.file); // Debug log
    
    // Extract the correct fields from Cloudinary response
    const publicId = req.file.filename || req.file.public_id || `gallery_${Date.now()}`;
    const originalFilename = req.file.originalname || req.file.original_filename || 'uploaded-image';
    
    const image = new Image({
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      type: 'gallery',
      uploadedBy: req.user.id,
    });
    
    console.log('Creating image with data:', {
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      type: 'gallery'
    });
    
    await image.save();
    res.status(201).json({ 
      message: 'Gallery image uploaded successfully', 
      image,
      cloudinaryUrl: req.file.path
    });
  } catch (err) {
    console.error('Error uploading gallery image:', err);
    res.status(500).json({ message: 'Failed to upload gallery image', error: err?.message || String(err) });
  }
});

// Project Image Upload Route (Admin only)
router.post('/upload/project', adminMiddleware, projectUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', error: 'req.file is undefined' });
    }
    
    console.log('Uploaded file object:', req.file); // Debug log
    
    // Extract the correct fields from Cloudinary response
    const publicId = req.file.filename || req.file.public_id || `project_${Date.now()}`;
    const originalFilename = req.file.originalname || req.file.original_filename || 'uploaded-image';
    
    const image = new Image({
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      type: 'project',
      projectId: req.body.projectId || null, // Optional: link to specific project
      uploadedBy: req.user.id,
    });
    
    console.log('Creating image with data:', {
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      type: 'project'
    });
    
    await image.save();
    res.status(201).json({ 
      message: 'Project image uploaded successfully', 
      image,
      cloudinaryUrl: req.file.path
    });
  } catch (err) {
    console.error('Error uploading project image:', err);
    res.status(500).json({ message: 'Failed to upload project image', error: err?.message || String(err) });
  }
});

// Profile Picture Upload Route (Admin only)
router.post('/upload/profile', adminMiddleware, profileUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', error: 'req.file is undefined' });
    }
    
    console.log('Uploaded file object:', req.file); // Debug log
    console.log('User object:', req.user); // Debug log for user
    
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed', error: 'req.user.id is undefined' });
    }
    
    // Extract the correct fields from Cloudinary response
    const publicId = req.file.filename || req.file.public_id || `profile_${Date.now()}`;
    const originalFilename = req.file.originalname || req.file.original_filename || 'profile-picture';
    
    // Mark previous profile pictures as inactive
    await Image.updateMany(
      { type: 'profile', isActive: true },
      { isActive: false }
    );
    
    const image = new Image({
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      description: req.body.description || 'Profile Picture',
      tags: ['profile'],
      type: 'profile',
      isActive: true, // Mark as current profile picture
      uploadedBy: req.user.id,
    });
    
    console.log('Creating image with data:', {
      url: req.file.path,
      publicId: publicId,
      filename: originalFilename,
      type: 'profile'
    });
    
    await image.save();
    res.status(201).json({ 
      message: 'Profile picture uploaded successfully', 
      image,
      cloudinaryUrl: req.file.path
    });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ message: 'Failed to upload profile picture', error: err?.message || String(err) });
  }
});

// Get all images (Public route - no auth required)
router.get('/', async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    // For profile pictures, only return active one
    if (type === 'profile') {
      query.isActive = true;
    }
    
    const skip = (page - 1) * parseInt(limit);
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('uploadedBy', 'username');
      
    const total = await Image.countDocuments(query);
    
    res.json({
      images,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: images.length,
        totalImages: total
      }
    });
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

// Get images by type (Public route)
router.get('/gallery', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const images = await Image.find({ type: 'gallery' })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('uploadedBy', 'username');
      
    res.json(images);
  } catch (err) {
    console.error('Error fetching gallery images:', err);
    res.status(500).json({ message: 'Failed to fetch gallery images' });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const { projectId, limit = 20, page = 1 } = req.query;
    const query = { type: 'project' };
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    const skip = (page - 1) * parseInt(limit);
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('uploadedBy', 'username');
      
    res.json(images);
  } catch (err) {
    console.error('Error fetching project images:', err);
    res.status(500).json({ message: 'Failed to fetch project images' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const profileImage = await Image.findOne({ 
      type: 'profile', 
      isActive: true 
    }).populate('uploadedBy', 'username');
    
    res.json(profileImage);
  } catch (err) {
    console.error('Error fetching profile image:', err);
    res.status(500).json({ message: 'Failed to fetch profile image' });
  }
});

// Delete image route (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    console.log('Deleting image:', image.publicId);
    
    // Use the improved deleteImage function from cloudinary utils
    try {
      const deleteResult = await deleteImage(image.publicId);
      console.log('Cloudinary delete successful:', deleteResult);
      
      if (deleteResult.warning) {
        console.warn('Delete operation warning:', deleteResult.warning);
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary delete failed, but continuing with database deletion:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }
    
    // Delete from database
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Image deleted successfully',
      imageId: req.params.id
    });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ 
      message: 'Failed to delete image', 
      error: err?.message || 'Unknown error occurred'
    });
  }
});

export default router;