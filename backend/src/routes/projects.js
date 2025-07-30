import express from 'express';
import { 
  getProjects, 
  getProjectsByUsername, 
  getDefaultProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectById 
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/auth.js';
import { projectUpload } from '../utils/uploaders.js';

const router = express.Router();

// Public routes for portfolio viewing
router.get('/default', getDefaultProjects); // Get default portfolio projects
router.get('/user/:username', getProjectsByUsername); // Get projects by username
router.get('/single/:id', getProjectById); // Get single project by ID

// Authenticated routes for portfolio management
router.get('/', getProjects); // Get user's own projects (or default if not authenticated)
router.post('/create', authMiddleware, projectUpload.single('thumbnail'), createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

// Legacy route with file upload (enhanced for multi-portfolio)
router.post(
  '/create-with-upload',
  authMiddleware,
  projectUpload.single('thumbnail'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thumbnail is required' });
      }

      const { title, description, skills, liveLink, githubLink, featured, order } = req.body;
      const userId = req.user.userId || req.user.id;

      const projectData = {
        title,
        description,
        thumbnail: req.file.path, // Cloudinary URL
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        liveLink,
        githubLink,
        userId,
        featured: featured === 'true' || featured === true,
        order: parseInt(order) || 0
      };

      const { Project } = await import('../models/index.js');
      const newProject = new Project(projectData);
      await newProject.save();

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject,
      });
    } catch (error) {
      console.error('Error creating project with upload:', error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  }
);

// Update project with thumbnail upload
router.put(
  '/update-with-upload/:id',
  authMiddleware,
  projectUpload.single('thumbnail'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, skills, liveLink, githubLink, featured, order } = req.body;
      const userId = req.user.userId || req.user.id;

      const { Project } = await import('../models/index.js');

      // Find project and check ownership
      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (existingProject.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }

      const updateData = {
        title,
        description,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        liveLink,
        githubLink,
        featured: featured === 'true' || featured === true,
        order: parseInt(order) || 0
      };

      // Add new thumbnail if uploaded
      if (req.file) {
        updateData.thumbnail = req.file.path;
      }

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      });

      res.status(200).json({ 
        message: 'Project updated successfully', 
        project: updatedProject 
      });
    } catch (error) {
      console.error('Error updating project with upload:', error);
      res.status(500).json({ message: 'Failed to update project' });
    }
  }
);

export default router;
