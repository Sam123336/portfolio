import mongoose from 'mongoose';

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  thumbnail: String,
  liveLink: String,
  githubLink: String
}, { timestamps: true });

// Image schema
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
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Music schema
const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  duration: Number
}, { timestamps: true });

// Skills schema
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
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
  icon: String, // Optional icon URL or name
  color: String, // Optional color for the skill badge
  description: String // Optional description
}, { timestamps: true });

// Contact schema (for tracking contact attempts)
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
  userAgent: String
}, { timestamps: true });

// Analytics schema for tracking user interactions
const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['page_view', 'project_click', 'contact_form_view', 'contact_form_submit', 'image_view', 'skill_view', 'external_link_click']
  },
  page: String, // which page was viewed
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    sessionId: String,
    duration: Number, // time spent on page/action
    clickPosition: {
      x: Number,
      y: Number
    },
    deviceType: String, // mobile, tablet, desktop
    country: String,
    city: String
  }
}, { timestamps: true });

// Visitor session schema for unique visitor tracking
const visitorSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
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
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Image = mongoose.model('Image', imageSchema);
export const Music = mongoose.model('Music', musicSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Analytics = mongoose.model('Analytics', analyticsSchema);
export const VisitorSession = mongoose.model('VisitorSession', visitorSessionSchema);
