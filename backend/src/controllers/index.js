import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController';
import { registerUser, loginUser } from '../controllers/authController';
import { uploadImage, getImages } from '../controllers/imageController';
import { uploadMusic, getMusic } from '../controllers/musicController';
import { contactForm } from '../controllers/contactController';

export {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  registerUser,
  loginUser,
  uploadImage,
  getImages,
  uploadMusic,
  getMusic,
  contactForm,
};