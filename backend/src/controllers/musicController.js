import { Music } from '../models/index.js';
import mongoose from 'mongoose';

const getMusic = async (req, res) => {
    try {
        const musicList = await Music.find().populate('uploadedBy', 'username email').sort({ createdAt: -1 });
        res.status(200).json(musicList);
    } catch (error) {
        console.error('Error fetching music:', error);
        res.status(500).json({ message: 'Failed to fetch music' });
    }
};

const getDefaultMusic = async (req, res) => {
    try {
        const defaultMusic = await Music.findOne().sort({ createdAt: -1 });
        if (!defaultMusic) {
            return res.status(404).json({ message: 'No default music found' });
        }
        res.status(200).json(defaultMusic);
    } catch (error) {
        console.error('Error fetching default music:', error);
        res.status(500).json({ message: 'Failed to fetch default music' });
    }
};

const uploadMusic = async (req, res) => {
    try {
        const { title, artist } = req.body;
        
        console.log('Upload request received:');
        console.log('Body:', req.body);
        console.log('File:', req.file);
        
        // Check for file upload
        if (!req.file) {
            return res.status(400).json({ message: 'No music file uploaded' });
        }

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (!artist) {
            return res.status(400).json({ message: 'Artist is required' });
        }

        // Log file details for debugging
        console.log('File uploaded to Cloudinary:');
        console.log('URL:', req.file.path);
        console.log('Public ID:', req.file.filename);

        const newMusic = new Music({
            title,
            artist,
            url: req.file.path, // Cloudinary URL
            publicId: req.file.filename, // Cloudinary public ID
            duration: req.body.duration ? parseInt(req.body.duration) : null // Optional duration
        });

        await newMusic.save();
        console.log('Music saved successfully:', newMusic);
        
        res.status(201).json({ 
            message: 'Music uploaded successfully', 
            music: newMusic 
        });
    } catch (error) {
        console.error('Error uploading music:', error);
        res.status(500).json({ 
            message: 'Failed to upload music',
            error: error.message 
        });
    }
};

const updateMusic = async (req, res) => {
    const { id } = req.params;
    const { title, artist, url } = req.body;
    try {
        const updated = await Music.findByIdAndUpdate(
            id,
            { title, artist, url },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Music not found' });
        res.status(200).json({ message: 'Music updated', music: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update music', error });
    }
};

const setDefaultMusic = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, unset all current default music
        await Music.updateMany({}, { isDefault: false });
        
        // Set the specified music as default
        const updatedMusic = await Music.findByIdAndUpdate(
            id,
            { isDefault: true },
            { new: true }
        );
        
        if (!updatedMusic) {
            return res.status(404).json({ message: 'Music not found' });
        }
        
        res.status(200).json({ 
            message: 'Default music set successfully', 
            music: updatedMusic 
        });
    } catch (error) {
        console.error('Error setting default music:', error);
        res.status(500).json({ message: 'Failed to set default music' });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the music to delete
        const musicToDelete = await Music.findById(id);
        if (!musicToDelete) {
            return res.status(404).json({ message: 'Music not found' });
        }
        
        // Delete from Cloudinary if publicId exists
        if (musicToDelete.publicId) {
            try {
                const { cloudinary } = await import('../utils/cloudinary.js');
                await cloudinary.uploader.destroy(musicToDelete.publicId, { resource_type: 'video' });
                console.log('Music file deleted from Cloudinary:', musicToDelete.publicId);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        }
        
        // Delete from database
        await Music.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'Music deleted successfully' });
    } catch (error) {
        console.error('Error deleting music:', error);
        res.status(500).json({ message: 'Failed to delete music' });
    }
};

export { getMusic, getDefaultMusic, uploadMusic, updateMusic, deleteMusic, setDefaultMusic };