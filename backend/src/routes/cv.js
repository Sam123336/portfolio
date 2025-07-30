import express from 'express';
import { getCV, uploadCV, deleteCV, getAllCVs, setActiveCV } from '../controllers/cvController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { cvUpload } from '../utils/uploaders.js';

const router = express.Router();

// Public routes
router.get('/', getCV); // Get default CV
router.get('/user/:userId', getCV); // Get CV by user ID

// Protected routes (Admin only)
router.post('/upload', adminMiddleware, cvUpload.single('cv'), uploadCV);
router.get('/all', adminMiddleware, getAllCVs);
router.put('/active/:id', adminMiddleware, setActiveCV);
router.delete('/:id', adminMiddleware, deleteCV);

export default router;