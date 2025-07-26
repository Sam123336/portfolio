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
          className={`${iconData.className} ${size} ${iconData.colored ? 'colored' : ''}`}
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
                      className="group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105"
                      style={{
                        animationDelay: `${categoryIndex * 200 + index * 100}ms`,
                      }}
                    >
                      {/* Skill Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner border border-gray-600/30">
                            <SkillIcon iconData={iconData} size="w-8 h-8" />
                          </div>
                          {/* Proficiency indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Skill Name */}
                      <div className="text-center">
                        <h4 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                          {skill.name}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium">
                          {skill.proficiency}
                        </p>
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
    </section>
  );
};

export default SkillsShowcase;