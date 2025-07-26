import React, { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { ModernButton, ModernCard, Badge } from '../components/ui/ModernComponents';
import { useImages } from '../hooks/useImages';

const Projects = () => {
  const { projects, fetchProjects, addProject } = useProjects();
  const { images, fetchImages } = useImages();
  const { user } = useAuth();
  const isAdmin = !!user;
  const [form, setForm] = useState({ title: '', description: '', skills: '', liveLink: '', githubLink: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { 
    fetchProjects();
    fetchImages();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleFileChange = e => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      
      await addProject(formData);
      setForm({ title: '', description: '', skills: '', liveLink: '', githubLink: '' });
      setThumbnailFile(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get all unique skills for filtering
  const allSkills = [...new Set(projects.flatMap(p => p.skills || []))];
  
  // Filter projects based on selected skill
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.skills?.includes(filter));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="space-y-4">
              <Badge variant="gradient" size="lg" className="shadow-lg">
                🚀 My Work
              </Badge>
              <h1 className="text-5xl sm:text-6xl font-bold">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore my portfolio of innovative web applications, creative solutions, and cutting-edge technical implementations
              </p>
            </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <ModernCard variant="glass" className="mb-12 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Management</h2>
                  <p className="text-gray-600 dark:text-gray-300">Create and manage your portfolio projects</p>
                </div>
                <ModernButton 
                  variant={showForm ? "secondary" : "primary"}
                  onClick={() => setShowForm(!showForm)}
                  icon={showForm ? 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg> :
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  {showForm ? 'Cancel' : 'Add New Project'}
                </ModernButton>
              </div>

              {showForm && (
                <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">Project Title</label>
                    <input 
                      name="title" 
                      value={form.title} 
                      onChange={handleChange} 
                      placeholder="Enter an engaging project title" 
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm dark:text-white" 
                      required 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">Description</label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      placeholder="Describe your project's features, technologies, and impact" 
                      rows="4"
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none dark:text-white" 
                      required 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">Project Thumbnail</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input 
                          type="file" 
                          onChange={handleFileChange} 
                          accept="image/*"
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">Technologies & Skills</label>
                    <input 
                      name="skills" 
                      value={form.skills} 
                      onChange={handleChange} 
                      placeholder="React, Node.js, MongoDB, Tailwind CSS" 
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm dark:text-white" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">Live Demo URL</label>
                    <input 
                      name="liveLink" 
                      value={form.liveLink} 
                      onChange={handleChange} 
                      placeholder="https://your-amazing-project.com" 
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm dark:text-white" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 dark:text-gray-200 mb-3">GitHub Repository</label>
                    <input 
                      name="githubLink" 
                      value={form.githubLink} 
                      onChange={handleChange} 
                      placeholder="https://github.com/username/awesome-project" 
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm dark:text-white" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <ModernButton 
                      type="submit"
                      variant="gradient"
                      size="lg"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>}
                    >
                      {isSubmitting ? 'Creating Project...' : 'Create Project'}
                    </ModernButton>
                  </div>
                </form>
              )}
            </ModernCard>
          )}

          {/* Filter Buttons */}
          {allSkills.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <ModernButton
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Projects
                </ModernButton>
                {allSkills.map(skill => (
                  <ModernButton
                    key={skill}
                    variant={filter === skill ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(skill)}
                  >
                    {skill}
                  </ModernButton>
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(p => (
              <ModernCard key={p._id} variant="default" className="p-0">
                {p.thumbnail ? (
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={p.thumbnail} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="gradient" size="sm">
                        Featured
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">Project Preview</p>
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {p.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">{p.description}</p>
                  
                  {p.skills && p.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.skills.map((skill, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    {p.liveLink && (
                      <ModernButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(p.liveLink, '_blank')}
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>}
                      >
                        Live Demo
                      </ModernButton>
                    )}
                    {p.githubLink && (
                      <ModernButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(p.githubLink, '_blank')}
                        icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>}
                      >
                        GitHub
                      </ModernButton>
                    )}
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <ModernCard variant="glass" className="max-w-md mx-auto p-12">
                <svg className="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {filter === 'all' 
                    ? 'No projects have been added yet.' 
                    : `No projects found with the skill "${filter}".`
                  }
                </p>
              </ModernCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;