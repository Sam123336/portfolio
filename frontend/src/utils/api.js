import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Increase to 30 seconds for image uploads
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // If we get a 401 error, clear the stored tokens
    if (error.response?.status === 401) {
      console.log('Unauthorized access detected, clearing stored authentication');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't auto-redirect here, let the components handle it
    }
    
    // If we get a 400 error with "Invalid token" message, clear the stored tokens
    if (error.response?.status === 400 && 
        error.response?.data?.message === 'Invalid token.') {
      console.log('Invalid token detected, clearing stored authentication');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Function to get all projects (default portfolio)
export const getProjects = async () => {
    const response = await api.get(`/projects`);
    return response.data;
};

// Function to get projects by user ID (for specific portfolios)
export const getUserProjects = async (userId) => {
    const response = await api.get(`/projects/user/${userId}`);
    return response.data;
};

// Function to get a single project by ID
export const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

// Function to create a new project
export const createProject = async (projectData) => {
    const response = await api.post(`/projects/create`, projectData, {
        headers: projectData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};

// Function to update a project
export const updateProject = async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
};

// Function to delete a project
export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

// Function to get user portfolio data
export const getUserPortfolio = async (userId) => {
    const response = await api.get(`/auth/portfolio/${userId}`);
    return response.data;
};

// Function to update user portfolio data
export const updateUserPortfolio = async (portfolioData) => {
    const response = await api.put(`/auth/portfolio`, portfolioData);
    return response.data;
};

// Function to log in a user
export const loginUser = async (credentials) => {
    try {
        console.log('Making login request to:', `${API_BASE}/auth/login`);
        
        // Prepare login data - support both email and username
        const loginData = {
            password: credentials.password
        };
        
        // Check if the input looks like an email or username
        const input = credentials.username || credentials.email;
        if (input) {
            // If it contains @, treat as email, otherwise as username
            if (input.includes('@')) {
                loginData.email = input;
            } else {
                loginData.username = input;
            }
        }
        
        console.log('Login data being sent:', { ...loginData, password: '***' });
        
        const response = await api.post(`/auth/login`, loginData);
        console.log('Login API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

// Function to register a new user
export const registerUser = async (userData) => {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
};

// Function to register a new admin with portfolio
export const registerAdmin = async (adminData) => {
    try {
        console.log('Making admin registration request to:', `${API_BASE}/auth/admin/register`);
        const response = await api.post(`/auth/admin/register`, adminData);
        console.log('Admin registration API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Admin registration API error:', error);
        throw error;
    }
};

// MUSIC ENDPOINTS
export const getMusic = async () => {
  const response = await api.get('/music');
  return response.data;
};

// Function to get music by user ID (for specific portfolios)
export const getUserMusic = async (userId) => {
  const response = await api.get(`/music/user/${userId}`);
  return response.data;
};

export const uploadMusic = async (musicData) => {
  // Create a config with extended timeout for music uploads
  const uploadConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 120 seconds for music uploads (larger files)
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Music upload progress: ${percentCompleted}%`);
    }
  };
  
  const response = await api.post('/music/upload', musicData, uploadConfig);
  return response.data.music;
};

export const setDefaultMusic = async (id) => {
  const response = await api.put(`/music/default/${id}`);
  return response.data;
};

export const deleteMusic = async (id) => {
  const response = await api.delete(`/music/${id}`);
  return response.data;
};

// IMAGES ENDPOINTS
export const getImages = async () => {
  const response = await api.get('/images');
  return response.data.images; // Extract the images array from the response object
};

// Function to get images by user ID (for specific portfolios)
export const getUserImages = async (userId) => {
  const response = await api.get(`/images/user/${userId}`);
  return response.data.images;
};

export const uploadImage = async (imageData) => {
  // Create a config with extended timeout for image uploads
  const uploadConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60 seconds for image uploads
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percentCompleted}%`);
    }
  };
  
  const response = await api.post('/images/upload/gallery', imageData, uploadConfig);
  return response.data.image;
};

export const uploadProfilePicture = async (imageData) => {
  // Create a config with extended timeout for image uploads
  const uploadConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60 seconds for image uploads
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Profile upload progress: ${percentCompleted}%`);
    }
  };
  
  const response = await api.post('/images/upload/profile', imageData, uploadConfig);
  return response.data.image;
};

export const getProfilePicture = async () => {
  const response = await api.get('/images/profile');
  return response.data;
};

// Function to get profile picture by user ID (for specific portfolios)
export const getUserProfilePicture = async (userId) => {
  const response = await api.get(`/images/profile/${userId}`);
  return response.data;
};

export const deleteImage = async (id) => {
  await api.delete(`/images/${id}`);
};

// CV ENDPOINTS
export const getCV = async (userId = null) => {
  const url = userId ? `/cv/user/${userId}` : '/cv';
  const response = await api.get(url);
  return response.data;
};

export const uploadCV = async (cvData) => {
  const uploadConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 120 seconds for PDF uploads
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`CV upload progress: ${percentCompleted}%`);
    }
  };
  
  const response = await api.post('/cv/upload', cvData, uploadConfig);
  return response.data;
};

export const getAllCVs = async () => {
  const response = await api.get('/cv/all');
  return response.data;
};

export const setActiveCV = async (cvId) => {
  const response = await api.put(`/cv/active/${cvId}`);
  return response.data;
};

export const deleteCV = async (cvId) => {
  const response = await api.delete(`/cv/${cvId}`);
  return response.data;
};

// CONTACT ENDPOINT
export const sendContact = async (form) => {
  await api.post('/contact', form);
};

export { api };