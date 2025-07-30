import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js';

// Configure Cloudinary storage for projects
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  },
});

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

// Configure Cloudinary storage for music
const musicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/music',
    allowed_formats: ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'],
    resource_type: 'video' // Use 'video' for audio files in Cloudinary
  },
});

// Configure Cloudinary storage for CV PDFs
const cvStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/cv',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // Use 'raw' for PDF files in Cloudinary
  },
});

// Create multer upload instances
export const projectUpload = multer({ 
  storage: projectStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const imageUpload = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export const musicUpload = multer({ 
  storage: musicStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

export const cvUpload = multer({ 
  storage: cvStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for PDFs
  }
});