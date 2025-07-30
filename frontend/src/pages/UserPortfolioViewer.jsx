import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const UserPortfolioViewer = () => {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserPortfolio();
  }, [userId]);

  const fetchUserPortfolio = async () => {
    try {
      setLoading(true);
      
      // Fetch user portfolio data
      const portfolioResponse = await api.get(`/api/portfolio/${userId}`);
      setPortfolio(portfolioResponse.data);

      // Fetch user's projects
      try {
        const projectsResponse = await api.get(`/api/projects/user/${userId}`);
        setProjects(projectsResponse.data);
      } catch (err) {
        console.log('No projects found for user');
      }

      // Fetch user's skills
      try {
        const skillsResponse = await api.get(`/api/skills/user/${userId}`);
        setSkills(skillsResponse.data);
      } catch (err) {
        console.log('No skills found for user');
      }

      // Fetch user's images
      try {
        const imagesResponse = await api.get(`/api/images/user/${userId}`);
        setImages(imagesResponse.data);
      } catch (err) {
        console.log('No images found for user');
      }

    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Portfolio not found or user does not exist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-300 mb-8">{error || 'The requested portfolio does not exist.'}</p>
          <Link 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">{portfolio.title}</h1>
            <Link 
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse Other Portfolios
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {portfolio.title}
            </h1>
            {portfolio.subtitle && (
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                {portfolio.subtitle}
              </p>
            )}
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {portfolio.description}
            </p>
          </motion.div>

          {/* Social Links */}
          {(portfolio.linkedinUrl || portfolio.githubUrl || portfolio.twitterUrl || portfolio.websiteUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center space-x-6 mt-8"
            >
              {portfolio.linkedinUrl && (
                <a 
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"
                >
                  LinkedIn
                </a>
              )}
              {portfolio.githubUrl && (
                <a 
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  GitHub
                </a>
              )}
              {portfolio.twitterUrl && (
                <a 
                  href={portfolio.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"
                >
                  Twitter
                </a>
              )}
              {portfolio.websiteUrl && (
                <a 
                  href={portfolio.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors text-2xl"
                >
                  Website
                </a>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-12">Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="text-white font-semibold mb-2">{skill.name}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{skill.level}%</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-12">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 text-sm rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-4">
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Images Gallery */}
      {images.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-12">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-white font-bold text-lg">{image.title}</h3>
                        {image.description && (
                          <p className="text-gray-300 mt-2">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(portfolio.experience || portfolio.education) && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {portfolio.experience && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Experience</h3>
                  <p className="text-gray-300 leading-relaxed">{portfolio.experience}</p>
                </motion.div>
              )}
              {portfolio.education && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Education</h3>
                  <p className="text-gray-300 leading-relaxed">{portfolio.education}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 {portfolio.title}. Portfolio powered by Multi-Portfolio Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserPortfolioViewer;