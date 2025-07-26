import express from 'express';
const router = express.Router();
import { Project } from '../models/index.js';
import { adminMiddleware } from '../middleware/auth.js';
// Import your existing uploader
import { projectUpload } from '../utils/uploaders.js'; // Assume it's exported

router.post(
  '/create',
  adminMiddleware,
  projectUpload.single('thumbnail'), // Uploads 'thumbnail' field
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thumbnail is required' });
      }

      const { title, description, skills, liveLink, githubLink } = req.body;

      const newProject = new Project({
        title,
        description,
        thumbnail: req.file.path, // Cloudinary URL
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        liveLink,
        githubLink,
        createdBy: req.user._id,
      });

      await newProject.save();

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  }
);

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'username email').sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// PUT update project
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { title, description, skills, liveLink, githubLink } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        liveLink,
        githubLink,
      },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
