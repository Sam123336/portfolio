import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    portfolioData: {
      fullName: '',
      title: '',
      subtitle: '',
      description: '',
      linkedinUrl: '',
      githubUrl: '',
      twitterUrl: '',
      websiteUrl: '',
      skills: [],
      experience: '',
      education: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('portfolio.')) {
      const portfolioField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        portfolioData: {
          ...prev.portfolioData,
          [portfolioField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.portfolioData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        portfolioData: {
          ...prev.portfolioData,
          skills: [...prev.portfolioData.skills, skillInput.trim()]
        }
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      portfolioData: {
        ...prev.portfolioData,
        skills: prev.portfolioData.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.portfolioData.fullName || !formData.portfolioData.title || !formData.portfolioData.description) {
      setError('Full name, portfolio title and description are required');
      return;
    }

    setLoading(true);

    try {
      // Send data in the format expected by backend
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        portfolioData: formData.portfolioData
      };
      
      const result = await registerAdmin(registrationData);
      console.log('Registration successful:', result);
      
      // Show success message with portfolio link
      alert(`Registration successful! Your portfolio is available at: ${window.location.origin}/${result.user.username}`);
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create Your Portfolio Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Register as an admin to create and manage your own portfolio
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          {/* Portfolio Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
              Portfolio Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="portfolio.fullName" className="block text-sm font-medium text-gray-300">
                  Full Name *
                </label>
                <input
                  id="portfolio.fullName"
                  name="portfolio.fullName"
                  type="text"
                  required
                  value={formData.portfolioData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="portfolio.title" className="block text-sm font-medium text-gray-300">
                  Portfolio Title *
                </label>
                <input
                  id="portfolio.title"
                  name="portfolio.title"
                  type="text"
                  required
                  value={formData.portfolioData.title}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., John Doe - Full Stack Developer"
                />
              </div>

              <div>
                <label htmlFor="portfolio.subtitle" className="block text-sm font-medium text-gray-300">
                  Subtitle
                </label>
                <input
                  id="portfolio.subtitle"
                  name="portfolio.subtitle"
                  type="text"
                  value={formData.portfolioData.subtitle}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Building amazing web experiences"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portfolio.description" className="block text-sm font-medium text-gray-300">
                Description *
              </label>
              <textarea
                id="portfolio.description"
                name="portfolio.description"
                required
                rows={4}
                value={formData.portfolioData.description}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself and your work..."
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="portfolio.linkedinUrl" className="block text-sm font-medium text-gray-300">
                  LinkedIn URL
                </label>
                <input
                  id="portfolio.linkedinUrl"
                  name="portfolio.linkedinUrl"
                  type="url"
                  value={formData.portfolioData.linkedinUrl}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label htmlFor="portfolio.githubUrl" className="block text-sm font-medium text-gray-300">
                  GitHub URL
                </label>
                <input
                  id="portfolio.githubUrl"
                  name="portfolio.githubUrl"
                  type="url"
                  value={formData.portfolioData.githubUrl}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label htmlFor="portfolio.twitterUrl" className="block text-sm font-medium text-gray-300">
                  Twitter URL
                </label>
                <input
                  id="portfolio.twitterUrl"
                  name="portfolio.twitterUrl"
                  type="url"
                  value={formData.portfolioData.twitterUrl}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label htmlFor="portfolio.websiteUrl" className="block text-sm font-medium text-gray-300">
                  Website URL
                </label>
                <input
                  id="portfolio.websiteUrl"
                  name="portfolio.websiteUrl"
                  type="url"
                  value={formData.portfolioData.websiteUrl}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.portfolioData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-200 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience and Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="portfolio.experience" className="block text-sm font-medium text-gray-300">
                  Experience
                </label>
                <textarea
                  id="portfolio.experience"
                  name="portfolio.experience"
                  rows={3}
                  value={formData.portfolioData.experience}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief overview of your work experience..."
                />
              </div>

              <div>
                <label htmlFor="portfolio.education" className="block text-sm font-medium text-gray-300">
                  Education
                </label>
                <textarea
                  id="portfolio.education"
                  name="portfolio.education"
                  rows={3}
                  value={formData.portfolioData.education}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your educational background..."
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-300">Already have an account? </span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;