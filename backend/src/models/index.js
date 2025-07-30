import mongoose from 'mongoose';

// User schema - Enhanced for multi-portfolio support
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  
  // Portfolio-specific information
  portfolioData: {
    fullName: { type: String, required: true },
    bio: String,
    title: { type: String, default: 'Full-Stack Developer' },
    location: String,
    profilePicture: {
      url: String,
      publicId: String
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String
    },
    contactEmail: String,
    phone: String,
    
    // Portfolio customization
    theme: {
      primaryColor: { type: String, default: '#3b82f6' },
      secondaryColor: { type: String, default: '#8b5cf6' },
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#1f2937' }
    },
    
    // Portfolio settings
    isPublic: { type: Boolean, default: true },
    showAnalytics: { type: Boolean, default: false },
    customDomain: String
  },
  
  // Default user flag (for your main portfolio)
  isDefaultUser: { type: Boolean, default: false }
}, { timestamps: true });

// Project schema - Add userId to associate with specific user
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  thumbnail: String,
  liveLink: String,
  githubLink: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Image schema - Add userId
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  filename: { type: String, required: true },
  description: String,
  tags: [String],
  type: { 
    type: String, 
    enum: ['gallery', 'thumbnail', 'project', 'profile'], 
    default: 'gallery' 
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isActive: { type: Boolean, default: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Music schema - Add userId
const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  duration: Number,
  isDefault: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Skills schema - Add userId
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other']
  },
  proficiency: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  icon: String,
  color: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Contact schema - Add userId to track which portfolio was contacted
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied'], 
    default: 'new' 
  },
  ipAddress: String,
  userAgent: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Which portfolio was contacted
}, { timestamps: true });

// Analytics schema - Add userId
const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['page_view', 'project_click', 'contact_form_view', 'contact_form_submit', 'image_view', 'skill_view', 'external_link_click']
  },
  page: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Which portfolio was viewed
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    sessionId: String,
    duration: Number,
    clickPosition: {
      x: Number,
      y: Number
    },
    deviceType: String,
    country: String,
    city: String
  }
}, { timestamps: true });

// Visitor session schema - Add userId
const visitorSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  ipAddress: String,
  userAgent: String,
  firstVisit: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  pageViews: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  referrer: String,
  country: String,
  city: String,
  deviceInfo: {
    type: String,
    browser: String,
    os: String,
    device: String
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// CV/Profile schema - Add userId
const cvSchema = new mongoose.Schema({
  // File information
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true }, // Cloudinary URL
  publicId: { type: String, required: true }, // Cloudinary public ID
  fileSize: { type: Number }, // File size in bytes
  
  // Metadata
  title: { type: String, default: 'CV' },
  description: { type: String },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  
  // User reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Add compound indexes for better performance
userSchema.index({ username: 1, email: 1 });
projectSchema.index({ userId: 1, featured: -1, order: 1 });
imageSchema.index({ userId: 1, type: 1 });
skillSchema.index({ userId: 1, category: 1 });

export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Image = mongoose.model('Image', imageSchema);
export const Music = mongoose.model('Music', musicSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Analytics = mongoose.model('Analytics', analyticsSchema);
export const VisitorSession = mongoose.model('VisitorSession', visitorSessionSchema);
export const CV = mongoose.model('CV', cvSchema);
