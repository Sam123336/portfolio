import express from 'express';
import { uploadMusic, getMusic, deleteMusic, getDefaultMusic } from '../controllers/musicController.js';
import { adminMiddleware } from '../middleware/auth.js';
import { musicUpload } from '../utils/uploaders.js';

const router = express.Router();

// Route to get the single default music track
router.get('/default', getDefaultMusic);

// Route for admin to upload a new default music track
router.post('/upload', adminMiddleware, musicUpload.single('musicFile'), uploadMusic);

// Route for admin to see all uploaded music tracks (for management)
router.get('/', adminMiddleware, getMusic);

// Route for admin to delete a music track
router.delete('/:id', adminMiddleware, deleteMusic);

export default router;
