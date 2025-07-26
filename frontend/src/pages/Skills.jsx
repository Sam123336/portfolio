import React, { useState, useRef, useEffect } from 'react';
import { useSkills } from '../hooks/useSkills';
import { getSkillIcon, getSuggestedIcon, parseIconString } from '../utils/skillIcons';
import { ModernButton, ModernCard, Badge } from '../components/ui/ModernComponents';

const Skills = () => {
  const {
    skills,
    categories,
    loading,
    error,
    addSkill,
    deleteSkill,
    searchSkills,
    isAdmin
  } = useSkills();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 'Intermediate',
    icon: '',
    color: '#3B82F6',
    description: ''
  });

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Predefined skill suggestions for search
  const predefinedSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
    'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
    'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material-UI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Firebase',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'GitHub Actions',
    'Git', 'Linux', 'Nginx', 'Apache', 'Webpack', 'Vite', 'Babel',
    'React Native', 'Flutter', 'Ionic', 'Xamarin',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'AI'
  ];

  const skillCategories = [
    'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other'
  ];

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Filter skills by category
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  // Group skills by category for display
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Handle search input with auto-icon suggestion
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Combine predefined skills with database search
      const dbResults = await searchSkills(value);
      const predefinedMatches = predefinedSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !skills.some(existingSkill => 
          existingSkill.name.toLowerCase() === skill.toLowerCase()
        )
      );
      
      const combined = [...new Set([...predefinedMatches, ...dbResults.map(s => s.name)])];
      setSearchSuggestions(combined.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click with auto-icon
  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion,
      icon: getSuggestedIcon(suggestion)
    }));
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSkill(formData);
      setFormData({
        name: '',
        category: 'Frontend',
        proficiency: 'Intermediate',
        icon: '',
        color: '#3B82F6',
        description: ''
      });
      setSearchQuery('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  // Handle skill deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(id);
      } catch (err) {
        console.error('Error deleting skill:', err);
      }
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get proficiency color
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Beginner': return 'from-gray-400 to-gray-500';
      case 'Intermediate': return 'from-blue-400 to-blue-600';
      case 'Advanced': return 'from-emerald-400 to-emerald-600';
      case 'Expert': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black py-8">
      {/* HeroUI-inspired dark background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/8 to-purple-600/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-600/5 to-orange-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="gradient" size="lg" className="shadow-lg shadow-blue-500/20 mb-4">
            ⚡ Technical Arsenal
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical skills, frameworks, and tools that I use to create exceptional digital experiences
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <ModernCard variant="glass" className="mb-12 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Skills Management</h2>
                <p className="text-gray-300">Add and manage your technical skills</p>
              </div>
              <ModernButton 
                variant={showAddForm ? "secondary" : "primary"}
                onClick={() => setShowAddForm(!showAddForm)}
                icon={showAddForm ? 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> :
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                {showAddForm ? 'Cancel' : 'Add New Skill'}
              </ModernButton>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                {/* Skill Name with Search */}
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Skill Name</label>
                  <div className="relative" ref={searchRef}>
                    <input 
                      type="text"
                      value={searchQuery || formData.name}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery && setShowSuggestions(true)}
                      placeholder="Start typing to search skills..."
                      className="w-full p-4 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400" 
                      required 
                    />
                    
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto"
                      >
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800/60 transition-colors duration-200 text-gray-200 hover:text-cyan-400 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-700/30 last:border-b-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-4 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-white"
                  >
                    {skillCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                    ))}
                  </select>
                </div>
                
                {/* Proficiency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Proficiency Level</label>
                  <select 
                    value={formData.proficiency}
                    onChange={(e) => setFormData({...formData, proficiency: e.target.value})}
                    className="w-full p-4 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-white"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level} value={level} className="bg-gray-800">{level}</option>
                    ))}
                  </select>
                </div>
                
                {/* Icon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Icon (auto-suggested)</label>
                  <input 
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="Auto-filled based on skill name"
                    className="w-full p-4 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400" 
                  />
                </div>
                
                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Badge Color</label>
                  <input 
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full h-12 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50" 
                  />
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Description (Optional)</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of your experience with this skill"
                    rows="3"
                    className="w-full p-4 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm resize-none text-white placeholder-gray-400" 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <ModernButton 
                    type="submit"
                    variant="gradient"
                    size="lg"
                    disabled={loading}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>}
                  >
                    Add Skill
                  </ModernButton>
                </div>
              </form>
            )}
          </ModernCard>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <ModernButton
              variant={selectedCategory === 'All' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('All')}
            >
              All Skills ({skills.length})
            </ModernButton>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <ModernButton
                key={category}
                variant={selectedCategory === category ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({categorySkills.length})
              </ModernButton>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredSkills.map((skill, index) => (
              <SkillCard 
                key={skill._id} 
                skill={skill} 
                isAdmin={isAdmin}
                onDelete={handleDelete}
                getProficiencyColor={getProficiencyColor}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ModernCard variant="glass" className="max-w-md mx-auto p-12">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-3">No skills found</h3>
              <p className="text-gray-300">
                {selectedCategory === 'All' 
                  ? 'No skills have been added yet.' 
                  : `No skills found in the "${selectedCategory}" category.`
                }
              </p>
            </ModernCard>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-950/20 border border-red-500/30 rounded-2xl backdrop-blur-xl">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Skill Icon Component
const SkillIcon = ({ iconData, size = "w-5 h-5" }) => {
  if (!iconData) return null;
  
  if (iconData.type === 'devicon') {
    return (
      <i 
        className={`${iconData.className} ${size} ${iconData.colored ? 'colored' : ''}`}
        style={{ fontSize: size === 'w-6 h-6' ? '24px' : '20px' }}
      />
    );
  } else {
    return (
      <span className={`${size} flex items-center justify-center text-lg`}>
        {iconData.emoji}
      </span>
    );
  }
};

// Skill Card Component
const SkillCard = ({ skill, isAdmin, onDelete, getProficiencyColor, index }) => {
  const iconData = skill.icon 
    ? parseIconString(skill.icon) || getSkillIcon(skill.name)
    : getSkillIcon(skill.name);

  return (
    <ModernCard 
      variant="default" 
      className="p-6 group"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner border border-gray-600/30">
            <SkillIcon iconData={iconData} size="w-6 h-6" />
          </div>
          {/* Proficiency indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => onDelete(skill._id)}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-all duration-300 text-red-400 hover:text-red-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors duration-300">
          {skill.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <Badge variant="primary" size="sm">
            {skill.category}
          </Badge>
          <span className="text-xs text-gray-400 font-medium">
            {skill.proficiency}
          </span>
        </div>

        {skill.description && (
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {skill.description}
          </p>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </ModernCard>
  );
};

export default Skills;