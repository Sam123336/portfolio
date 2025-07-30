import { createProject, getProjects, updateProject, deleteProject } from './projectController.js';
import { registerUser, loginUser } from './authController.js';
import { uploadImage, getImages } from './imageController.js';
import { uploadMusic, getMusic } from './musicController.js';
import { contactForm } from './contactController.js';
import { getCV, createOrUpdateCV, initializeCV } from './cvController.js';

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
  getCV,
  createOrUpdateCV,
  initializeCV,
};