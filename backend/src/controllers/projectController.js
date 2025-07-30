import { Project, User } from '../models/index.js';

// Get projects for a specific user (public route)
export const getProjectsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    if (!user.portfolioData.isPublic) {
      return res.status(403).json({ message: 'This portfolio is private' });
    }
    
    const projects = await Project.find({ userId: user._id })
      .sort({ featured: -1, order: 1, createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by username:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get projects for default portfolio
export const getDefaultProjects = async (req, res) => {
  try {
    // Find the default user
    let defaultUser = await User.findOne({ isDefaultUser: true });
    
    if (!defaultUser) {
      // Fall back to first admin if no default is set
      defaultUser = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    }
    
    if (!defaultUser) {
      return res.status(404).json({ message: 'No default portfolio found' });
    }
    
    const projects = await Project.find({ userId: defaultUser._id })
      .sort({ featured: -1, order: 1, createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching default projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all projects (for authenticated user's own portfolio)
export const getProjects = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      // If not authenticated, return default portfolio projects
      return getDefaultProjects(req, res);
    }
    
    const projects = await Project.find({ userId })
      .sort({ featured: -1, order: 1, createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new project (authenticated users only)
export const createProject = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const projectData = {
      ...req.body,
      userId,
      order: req.body.order || 0,
      featured: req.body.featured || false
    };
    
    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a project (only owner can update)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    
    // Find project and check ownership
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (existingProject.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const project = await Project.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a project (only owner can delete)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    
    // Find project and check ownership
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await Project.findByIdAndDelete(id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single project by ID (public route with portfolio context)
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.query; // Optional: to get project in context of specific portfolio
    
    let project = await Project.findById(id).populate('userId', 'username portfolioData');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // If username is provided, verify the project belongs to that user
    if (username && project.userId.username !== username) {
      return res.status(404).json({ message: 'Project not found in this portfolio' });
    }
    
    // Check if the portfolio is public
    if (!project.userId.portfolioData.isPublic) {
      return res.status(403).json({ message: 'This portfolio is private' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};