import React, { useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useMusic } from '../hooks/useMusic';
import { useImages } from '../hooks/useImages';
import { getProfilePicture } from '../utils/api';
import { Link } from 'react-router-dom';
import ImageCursorTrail from '../components/ui/ImageCursorTrail';
import { CardCarousel } from '../components/ui/card-carousel';
import TextScroll, { ContinuousTextScroll } from '../components/ui/TextScroll';
import SkillsShowcase from '../components/ui/SkillsShowcase';
import { FlipLink } from '../components/ui/TextEffectFlipper';
import { ModernButton, ModernCard, Badge } from '../components/ui/ModernComponents';

const PortfolioViewer = () => {
  const { projects, fetchProjects } = useProjects();
  const { musicList, fetchMusic } = useMusic();
  const { images, loading: imagesLoading, error: imagesError, fetchImages } = useImages();
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [profileLoading, setProfilePictureLoading] = React.useState(true);

  useEffect(() => {
    fetchProjects();
    fetchMusic();
    fetchImages();
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      setProfilePictureLoading(true);
      const profileData = await getProfilePicture();
      setProfilePicture(profileData);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    } finally {
      setProfilePictureLoading(false);
    }
  };

  // Add debugging logs to understand the data structure
  useEffect(() => {
    console.log('PortfolioViewer - Images data:', images);
    console.log('PortfolioViewer - Images loading:', imagesLoading);
    console.log('PortfolioViewer - Images error:', imagesError);
    console.log('PortfolioViewer - Images length:', images?.length);
    if (images && images.length > 0) {
      console.log('PortfolioViewer - First image:', images[0]);
      const galleryFiltered = images.filter(img => img.type === 'gallery');
      console.log('PortfolioViewer - Gallery images filtered:', galleryFiltered);
      console.log('PortfolioViewer - Gallery images count:', galleryFiltered.length);
    }
  }, [images, imagesLoading, imagesError]);

  // Filter only gallery images for CardSwipe with better error handling
  const galleryImages = React.useMemo(() => {
    if (imagesLoading) {
      console.log('Images still loading...');
      return [];
    }
    
    if (imagesError) {
      console.error('Error loading images:', imagesError);
      return [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400", 
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400",
        "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400"
      ];
    }
    
    if (images && Array.isArray(images) && images.length > 0) {
      const filtered = images.filter(img => img.type === 'gallery');
      console.log('Gallery images found:', filtered.length);
      if (filtered.length > 0) {
        const urls = filtered.slice(0, 5).map(img => img.url);
        console.log('Gallery URLs:', urls);
        return urls;
      }
    }
    
    console.log('No gallery images found, using fallback images');
    return [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400", 
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400"
    ];
  }, [images, imagesLoading, imagesError]);

  // Also use real images for cursor trail if available
  const cursorTrailImages = React.useMemo(() => {
    if (images && Array.isArray(images) && images.length > 0) {
      return images.slice(0, 6).map(img => img.url);
    }
    return [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400",
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400"
    ];
  }, [images]);

  // Debug the filtered gallery images
  console.log('PortfolioViewer - Final Gallery Images for CardSwipe:', galleryImages);

  return (
    <div className="min-h-screen bg-black">
      {/* HeroUI-inspired Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Deep dark background with HeroUI patterns */}
        <div className="absolute inset-0 bg-black">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-black to-black"></div>
          
          {/* Animated accent elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
        
        <ImageCursorTrail
          images={cursorTrailImages}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center min-h-screen flex items-center justify-center"
          trailColor="rgba(59, 130, 246, 0.8)"
          trailSize={150}
          trailDuration={1500}
          maxTrails={10}
        >
          <div className="relative z-10">
            <TextScroll direction="up" duration={1} delay={0.2}>
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  <Badge variant="gradient" size="lg" className="shadow-lg shadow-blue-500/20">
                    ✨ Welcome to my world
                  </Badge>
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                      Creative
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Portfolio
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Crafting digital experiences that blend innovation with artistry. 
                    Explore my journey through code, design, and creativity.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                  <ModernButton 
                    variant="primary"
                    size="lg"
                    href="/projects"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>}
                    iconPosition="right"
                  >
                    Explore Projects
                  </ModernButton>
                  
                  <ModernButton 
                    variant="glass"
                    size="lg"
                    href="/contact"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>}
                  >
                    Get In Touch
                  </ModernButton>
                </div>
              </div>
            </TextScroll>
          </div>
        </ImageCursorTrail>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Skills Showcase Section - Dark Theme */}
      <SkillsShowcase />

      {/* Profile Section with Picture */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <TextScroll direction="up" duration={0.8} delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/25 to-blue-600/25 backdrop-blur-xl rounded-full mb-6 border border-purple-500/30">
                <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">
                  👨‍💻 About Me
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Meet the Developer
                </span>
              </h2>
            </div>
          </TextScroll>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            <TextScroll direction="left" duration={0.8} delay={0.2}>
              <div className="flex-shrink-0">
                {profileLoading ? (
                  <div className="w-80 h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30 shadow-lg animate-pulse">
                    <svg className="w-20 h-20 text-purple-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                ) : profilePicture ? (
                  <div className="relative">
                    <img
                      src={profilePicture.url}
                      alt="Profile Picture"
                      className="w-80 h-80 rounded-full object-cover border-4 border-purple-600/50 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/25 hover:brightness-110 transform hover:scale-105 transition-all duration-500 cursor-pointer"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ) : (
                  <div className="w-80 h-80 bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-full flex items-center justify-center border-4 border-dashed border-gray-600/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </TextScroll>

            <TextScroll direction="right" duration={0.8} delay={0.3}>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Passionate Developer & Creative Thinker
                </h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  With a deep love for both technology and design, I craft digital experiences that bridge 
                  the gap between functionality and beauty. Every project is an opportunity to push boundaries 
                  and create something truly exceptional.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <ModernButton 
                    variant="primary"
                    size="lg"
                    href="/projects"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10" />
                    </svg>}
                  >
                    View My Work
                  </ModernButton>
                  <ModernButton 
                    variant="glass"
                    size="lg"
                    href="/contact"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>}
                  >
                    Get In Touch
                  </ModernButton>
                </div>
              </div>
            </TextScroll>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Dark HeroUI Theme */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* HeroUI-inspired dark background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/8 to-purple-600/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-600/5 to-orange-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.01]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <TextScroll direction="up" duration={0.8} delay={0.1}>
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-full mb-4 border border-blue-500/20">
                <span className="text-sm font-semibold text-blue-400 tracking-wide uppercase">
                  🚀 Featured Work
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Latest Projects
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover my most recent work showcasing cutting-edge technologies and creative solutions
              </p>
            </div>
          </TextScroll>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, index) => (
              <TextScroll key={p._id} direction="up" duration={0.6} delay={index * 0.2}>
                <div className="group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                  {p.thumbnail && (
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={p.thumbnail} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                          New
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">{p.description}</p>
                    
                    {p.skills && p.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
                            {skill}
                          </span>
                        ))}
                        {p.skills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-sm font-medium rounded-full border border-gray-500/30">
                            +{p.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-4 pt-4 border-t border-gray-700/50">
                      {p.liveLink && (
                        <button 
                          onClick={() => window.open(p.liveLink, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-800/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </button>
                      )}
                      {p.githubLink && (
                        <button 
                          onClick={() => window.open(p.githubLink, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-800/50 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 p-[1px]">
                      <div className="w-full h-full rounded-2xl bg-gray-900/80"></div>
                    </div>
                  </div>
                </div>
              </TextScroll>
            ))}
          </div>
          
          <TextScroll direction="up" duration={0.6} delay={0.4}>
            <div className="text-center mt-16">
              <a 
                href="/projects"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-blue-500/20"
              >
                <span>View All Projects</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </TextScroll>
        </div>
      </section>

      {/* Gallery Preview with Enhanced Dark Cards */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-slate-900 to-black relative overflow-hidden">
        {/* Enhanced dark background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/15 to-transparent rounded-full blur-3xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-500/12 to-orange-500/12 rounded-full blur-3xl animate-pulse delay-2500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-l from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <TextScroll direction="up" duration={0.8} delay={0.1}>
            <div className="text-center mb-20">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600/25 to-teal-600/25 backdrop-blur-xl rounded-full mb-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <span className="text-sm font-semibold text-emerald-300 tracking-wide uppercase">
                  🎨 Visual Gallery
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  Creative Showcase
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                A curated collection of visual artwork and creative photography that inspires my work
              </p>
            </div>
          </TextScroll>
          
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <TextScroll direction="right" duration={0.8} delay={0.3}>
              <div className="flex justify-center">
                {galleryImages.length > 0 ? (
                  <div className="relative">
                    {/* Enhanced CardSwipe with custom dark styling */}
                    <div className="relative w-full max-w-md">
                      <CardCarousel 
                        images={galleryImages}
                        autoplayDelay={4000}
                        slideShadows={true}
                        className="w-full"
                      />
                      
                      {/* Enhanced glow effects around carousel */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 to-purple-500/25 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl -z-10 animate-pulse delay-1000"></div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute -top-10 -left-10 w-4 h-4 bg-emerald-400/60 rounded-full animate-ping"></div>
                      <div className="absolute -top-6 -right-8 w-3 h-3 bg-cyan-400/60 rounded-full animate-ping delay-500"></div>
                      <div className="absolute -bottom-8 -left-6 w-2 h-2 bg-purple-400/60 rounded-full animate-ping delay-1000"></div>
                      <div className="absolute -bottom-10 -right-10 w-3 h-3 bg-pink-400/60 rounded-full animate-ping delay-1500"></div>
                    </div>
                    
                    {/* Gallery preview label */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-full">
                      <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Live Gallery</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    {/* Enhanced loading state */}
                    <div className="relative h-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/40 flex items-center justify-center overflow-hidden">
                      {/* Loading background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent animate-pulse"></div>
                      
                      <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 animate-pulse">
                          <svg className="w-10 h-10 text-emerald-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 font-semibold text-lg mb-2">Loading Gallery...</p>
                        <p className="text-gray-500 text-sm">Fetching creative content</p>
                        
                        {/* Loading dots animation */}
                        <div className="flex justify-center space-x-2 mt-4">
                          <div className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-400/60 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                      
                      {/* Subtle glow for loading state */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
                    </div>
                  </div>
                )}
              </div>
            </TextScroll>
          </div>
        </div>
      </section>

      {/* Call to Action with Enhanced Dark Styling */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-violet-400/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <TextScroll direction="up" duration={0.8} delay={0.1}>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full mb-6 border border-white/20">
              <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">
                💫 Let's Collaborate
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Let's Create Something Amazing
              </span>
            </h2>
            <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? I'm here to help you create digital experiences that make a lasting impact.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black/20 backdrop-blur-xl text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-500/20 border border-white/10 hover:border-purple-400/50 hover:bg-purple-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Start a Conversation</span>
            </a>
          </div>
        </TextScroll>
      </section>
    </div>
  );
};

export default PortfolioViewer;