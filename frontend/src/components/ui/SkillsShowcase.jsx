import React, { useEffect, useState } from 'react';
import { useSkills } from '../../hooks/useSkills';
import { getSkillIcon, parseIconString } from '../../utils/skillIcons';

const SkillsShowcase = () => {
  const { skills, fetchSkills } = useSkills();
  const [animatedSkills, setAnimatedSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      // Create animated entrance for skills
      const timer = setTimeout(() => {
        setAnimatedSkills(skills);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [skills]);

  const groupedSkills = animatedSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Beginner': return 'from-gray-400 to-gray-500';
      case 'Intermediate': return 'from-blue-400 to-blue-600';
      case 'Advanced': return 'from-emerald-400 to-emerald-600';
      case 'Expert': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const SkillIcon = ({ iconData, size = "w-8 h-8" }) => {
    if (!iconData) return null;
    
    if (iconData.type === 'devicon') {
      return (
        <i 
          className={`${iconData.className} ${size} ${iconData.colored ? 'colored dark-devicon' : 'dark-devicon'}`}
          style={{ fontSize: size === 'w-6 h-6' ? '24px' : '32px' }}
        />
      );
    } else {
      return (
        <span 
          className={`${size} flex items-center justify-center text-2xl`}
        >
          {iconData.emoji}
        </span>
      );
    }
  };

  if (skills.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
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
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-full mb-4 border border-blue-500/20">
            <span className="text-sm font-semibold text-blue-400 tracking-wide uppercase">
              ⚡ Technical Arsenal
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive toolkit of modern technologies and frameworks that power exceptional digital experiences
          </p>
        </div>

        {/* Skills Grid */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <div key={category} className="group">
              {/* Category Header */}
              <div className="flex items-center mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                    <span className="text-white font-bold text-lg">
                      {category.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-2xl font-bold text-white">
                    {category}
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <div className="hidden sm:block text-sm text-gray-400 font-medium">
                  {categorySkills.length} skills
                </div>
              </div>

              {/* Skills Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categorySkills.map((skill, index) => {
                  const iconData = skill.icon 
                    ? parseIconString(skill.icon) || getSkillIcon(skill.name)
                    : getSkillIcon(skill.name);

                  return (
                    <div
                      key={skill._id}
                      className="group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-700/30 transition-all duration-500 hover:transform hover:scale-105 skill-card-glow"
                      style={{
                        animationDelay: `${categoryIndex * 200 + index * 100}ms`,
                      }}
                    >
                      {/* Base glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-40 blur-xl transition-all duration-500 group-hover:opacity-80 group-hover:blur-2xl"></div>
                      
                      {/* Enhanced glow on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-3xl group-hover:scale-110"></div>
                      
                      {/* Card content container */}
                      <div className="relative z-10">
                        {/* Skill Icon */}
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner border border-gray-600/30 skill-icon-glow skill-icon-container">
                              {/* Icon glow background */}
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-lg opacity-60 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500"></div>
                              
                              {/* Enhanced icon glow on hover */}
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 opacity-0 blur-xl group-hover:opacity-100 group-hover:blur-2xl group-hover:scale-125 transition-all duration-500"></div>
                              
                              {/* Icon content with enhanced glow */}
                              <div className="relative z-10 skill-icon-wrapper">
                                <SkillIcon iconData={iconData} size="w-8 h-8" />
                              </div>
                            </div>
                            {/* Proficiency indicator with glow */}
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg proficiency-glow`}>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Skill Name */}
                        <div className="text-center">
                          <h4 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                            {skill.proficiency}
                          </p>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Animated border with glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                          <div className="w-full h-full rounded-2xl bg-gray-900/80"></div>
                        </div>
                      </div>
                      
                      {/* Pulse effect on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gray-900/60 backdrop-blur-xl rounded-full shadow-lg shadow-black/20 border border-gray-700/30">
            <span className="text-sm text-gray-300 font-medium mr-2">
              Want to see more technical details?
            </span>
            <div className="flex items-center text-cyan-400 font-semibold">
              <span className="mr-1">Explore Projects</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skill-card-glow {
          box-shadow: 
            0 4px 20px rgba(59, 130, 246, 0.15),
            0 0 40px rgba(168, 85, 247, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .skill-card-glow:hover {
          box-shadow: 
            0 8px 40px rgba(59, 130, 246, 0.4),
            0 0 80px rgba(168, 85, 247, 0.3),
            0 0 120px rgba(34, 211, 238, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: scale(1.05) translateY(-2px);
        }
        
        .skill-icon-glow {
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.3),
            0 0 30px rgba(168, 85, 247, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .skill-icon-container {
          position: relative;
          overflow: visible;
        }
        
        .skill-icon-container:hover .skill-icon-glow {
          box-shadow: 
            0 0 40px rgba(59, 130, 246, 0.6),
            0 0 60px rgba(168, 85, 247, 0.5),
            0 0 80px rgba(34, 211, 238, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .skill-icon-wrapper {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
          transition: all 0.3s ease;
        }
        
        .group:hover .skill-icon-wrapper {
          filter: 
            drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))
            drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))
            drop-shadow(0 0 30px rgba(34, 211, 238, 0.4));
          transform: scale(1.1);
        }
        
        .proficiency-glow {
          box-shadow: 
            0 0 15px rgba(59, 130, 246, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .group:hover .proficiency-glow {
          box-shadow: 
            0 0 25px rgba(59, 130, 246, 0.8),
            0 0 40px rgba(168, 85, 247, 0.6),
            0 0 50px rgba(34, 211, 238, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes icon-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5));
          }
        }
        
        .skill-icon-wrapper {
          animation: icon-glow-pulse 2.5s ease-in-out infinite;
        }
        
        .group:hover .skill-icon-wrapper {
          animation: none;
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 
              0 4px 20px rgba(59, 130, 246, 0.15),
              0 0 40px rgba(168, 85, 247, 0.1);
          }
          50% {
            box-shadow: 
              0 6px 30px rgba(59, 130, 246, 0.25),
              0 0 60px rgba(168, 85, 247, 0.2);
          }
        }
        
        .skill-card-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .skill-card-glow:hover {
          animation: none;
        }
        
        /* Enhanced icon container glow */
        .skill-icon-container::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: conic-gradient(
            from 0deg,
            rgba(59, 130, 246, 0.4),
            rgba(168, 85, 247, 0.4),
            rgba(34, 211, 238, 0.4),
            rgba(59, 130, 246, 0.4)
          );
          border-radius: 1rem;
          opacity: 0;
          filter: blur(8px);
          transition: all 0.5s ease;
          z-index: -1;
        }
        
        .group:hover .skill-icon-container::before {
          opacity: 0.8;
          filter: blur(12px);
          transform: scale(1.2);
        }
        
        /* Dark theme styling for DevIcons */
        .dark-devicon {
          filter: brightness(0.8) contrast(1.2) saturate(0.7);
          color: #e2e8f0 !important;
          transition: all 0.3s ease;
        }
        
        .group:hover .dark-devicon {
          filter: brightness(1.1) contrast(1.3) saturate(0.9);
          color: #94a3b8 !important;
        }
        
        /* Specific styling for React logo to make it darker */
        .devicon-react-original.dark-devicon {
          filter: brightness(0.6) contrast(1.4) saturate(0.5) hue-rotate(180deg);
        }
        
        .group:hover .devicon-react-original.dark-devicon {
          filter: brightness(0.8) contrast(1.5) saturate(0.7) hue-rotate(180deg);
        }
      `}</style>
    </section>
  );
};

export default SkillsShowcase;