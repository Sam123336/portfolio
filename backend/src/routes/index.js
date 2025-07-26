import express from 'express';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import imageRoutes from './images.js';
import musicRoutes from './music.js';
import contactRoutes from './contact.js';
import skillRoutes from './skills.js';
import analyticsRoutes from './analytics.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/images', imageRoutes);
router.use('/music', musicRoutes);
router.use('/contact', contactRoutes);
router.use('/skills', skillRoutes);
router.use('/analytics', analyticsRoutes);

export default router;