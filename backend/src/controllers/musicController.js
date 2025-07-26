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
        // Check for file upload
        if (!req.file) {
            return res.status(400).json({ message: 'No music file uploaded' });
        }
        const newMusic = new Music({
            title,
            artist: artist || '',
            url: req.file.path, // Set url from uploaded file
            isDefault: req.body.isDefault || false,
            uploadedBy: req.user ? req.user._id : null
        });
        await newMusic.save();
        res.status(201).json({ message: 'Music uploaded successfully', music: newMusic });
    } catch (error) {
        console.error('Error uploading music:', error);
        res.status(500).json({ message: 'Failed to upload music' });
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

const deleteMusic = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Music.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Music not found' });
        res.status(200).json({ message: 'Music deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete music', error });
    }
};

export { getMusic, getDefaultMusic, uploadMusic, updateMusic, deleteMusic };