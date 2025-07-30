import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ModernCard, ModernButton, Badge } from '../components/ui/ModernComponents';
import TextScroll from '../components/ui/TextScroll';

const BrowsePortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/portfolios/public');
      setPortfolios(response.data.portfolios || []);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Failed to load portfolios. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <ModernCard variant="glass" className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Portfolios</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <ModernButton onClick={fetchPortfolios} variant="primary">
            Try Again
          </ModernButton>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <TextScroll direction="up" duration={0.8} delay={0.1}>
            <div className="text-center mb-16">
              <div className="space-y-4">
                <Badge variant="gradient" size="lg" className="shadow-lg">
                  👥 Discover Talent
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Browse Portfolios
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Explore creative portfolios from talented developers, designers, and innovators around the world
                </p>
              </div>
            </div>
          </TextScroll>

          {/* Portfolios Grid */}
          {portfolios.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio, index) => (
                <TextScroll key={portfolio.username} direction="up" duration={0.6} delay={index * 0.1}>
                  <ModernCard variant="glass" className="group hover:scale-105 transition-all duration-500 h-full">
                    <div className="p-8">
                      {/* Profile Section */}
                      <div className="text-center mb-6">
                        {portfolio.portfolioData.profilePicture?.url ? (
                          <img
                            src={portfolio.portfolioData.profilePicture.url}
                            alt={portfolio.portfolioData.fullName}
                            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/30 mx-auto mb-4 group-hover:border-blue-400/50 transition-colors duration-300"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-400 group-hover:to-purple-500 transition-colors duration-300">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {portfolio.portfolioData.fullName}
                        </h3>
                        
                        <div className="flex items-center justify-center mb-2">
                          <Badge variant="secondary" size="sm">
                            @{portfolio.username}
                          </Badge>
                        </div>
                        
                        {portfolio.portfolioData.title && (
                          <p className="text-blue-400 font-medium mb-2">
                            {portfolio.portfolioData.title}
                          </p>
                        )}
                        
                        {portfolio.portfolioData.location && (
                          <div className="flex items-center justify-center text-gray-400 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {portfolio.portfolioData.location}
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      {portfolio.portfolioData.bio && (
                        <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {portfolio.portfolioData.bio}
                        </p>
                      )}

                      {/* Portfolio Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Joined {new Date(portfolio.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          to={`/portfolio/${portfolio.username}`}
                          className="flex-1"
                        >
                          <ModernButton 
                            variant="primary" 
                            size="sm" 
                            className="w-full group-hover:scale-105 transition-transform duration-300"
                          >
                            View Portfolio
                          </ModernButton>
                        </Link>
                        
                        {portfolio.portfolioData.socialLinks?.github && (
                          <a
                            href={`https://${portfolio.portfolioData.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-colors duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </ModernCard>
                </TextScroll>
              ))}
            </div>
          ) : (
            <TextScroll direction="up" duration={0.6} delay={0.3}>
              <div className="text-center py-20">
                <ModernCard variant="glass" className="max-w-md mx-auto p-12">
                  <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Public Portfolios Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Be the first to create a public portfolio and inspire others!
                  </p>
                  <Link to="/admin/register">
                    <ModernButton variant="primary">
                      Create Your Portfolio
                    </ModernButton>
                  </Link>
                </ModernCard>
              </div>
            </TextScroll>
          )}

          {/* Call to Action */}
          {portfolios.length > 0 && (
            <TextScroll direction="up" duration={0.6} delay={0.4}>
              <div className="text-center mt-20">
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/20">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Showcase Your Work?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join the community of talented creators and share your portfolio with the world
                  </p>
                  <Link to="/admin/register">
                    <ModernButton variant="gradient" size="lg">
                      Create Your Portfolio
                    </ModernButton>
                  </Link>
                </div>
              </div>
            </TextScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePortfolios;