import { Image } from '../models/index.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Get all images
export const getImages = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const images = await Image.find(filter)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const { description, tags, type = 'gallery' } = req.body;
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `portfolio-${type}`,
      resource_type: 'image'
    });
    
    // Save image metadata to database
    const image = new Image({
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      type,
      uploadedBy: req.user.userId
    });
    
    await image.save();
    await image.populate('uploadedBy', 'username');
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      image
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update image
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const image = await Image.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary
    await deleteFromCloudinary(image.publicId);
    
    // Delete from database
    await Image.findByIdAndDelete(id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};