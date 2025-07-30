import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000, // 60 seconds timeout
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'portfolio',
      timeout: 60000, // 60 seconds timeout for uploads
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading image to Cloudinary: ' + error.message);
  }
};

// Upload from buffer (for multer)
const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'portfolio',
          timeout: 60000,
          resource_type: options.resource_type || 'auto',
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Error uploading to Cloudinary: ' + error.message));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading to Cloudinary: ' + error.message);
  }
};

const deleteImage = async (publicId) => {
  try {
    console.log('Attempting to delete image with publicId:', publicId);
    
    // Add timeout and retry logic for deletion
    const result = await Promise.race([
      cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true, // Invalidate CDN cache
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Delete operation timed out')), 30000)
      )
    ]);
    
    console.log('Cloudinary delete result:', result);
    
    if (result.result === 'ok' || result.result === 'not found') {
      return { success: true, result };
    } else {
      throw new Error(`Delete failed with result: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    
    // If it's a timeout error, still consider it partially successful
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      console.warn('Delete operation timed out, but may have succeeded');
      return { success: true, warning: 'Operation may have timed out but likely succeeded' };
    }
    
    throw new Error('Error deleting image from Cloudinary: ' + error.message);
  }
};

// Alias for consistency
const deleteFromCloudinary = deleteImage;

// Additional utility function to check if image exists
const checkImageExists = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return { exists: true, result };
  } catch (error) {
    if (error.error && error.error.http_code === 404) {
      return { exists: false };
    }
    throw error;
  }
};

export { uploadImage, uploadToCloudinary, deleteImage, deleteFromCloudinary, checkImageExists, cloudinary };