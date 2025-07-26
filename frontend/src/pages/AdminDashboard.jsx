import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useMusic } from '../hooks/useMusic';
import { useImages } from '../hooks/useImages';
import { useAnalyticsDashboard } from '../hooks/useAnalytics';
import { uploadProfilePicture, getProfilePicture } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { LineChart, BarChart, DonutChart, ActivityFeed } from '../components/AnalyticsCharts';
import MusicManagement from '../components/MusicManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { projects, fetchProjects } = useProjects();
  const { musicList, fetchMusic, uploadMusic, deleteMusic, setDefaultMusic } = useMusic();
  const { images, fetchImages } = useImages();
  const { 
    data: analyticsData, 
    loading: analyticsLoading, 
    error: analyticsError,
    realTimeData,
    fetchDashboardData,
    fetchRealTimeData,
    updateContactStatus 
  } = useAnalyticsDashboard();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [musicForm, setMusicForm] = useState({ title: '', artist: '', duration: '' });
  const [musicFile, setMusicFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileUploadStatus, setProfileUploadStatus] = useState('');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProjects();
    fetchMusic();
    fetchImages();
  }, [user]);

  // Auto-refresh real-time data every 30 seconds
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchRealTimeData();
      const interval = setInterval(fetchRealTimeData, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchRealTimeData]);

  const handleMusicUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus('');
    setUploadProgress(0);
    
    try {
      // Validate required fields
      if (!musicForm.title || !musicForm.artist || !musicFile) {
        setUploadStatus('Please fill in all required fields and select a music file.');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('musicFile', musicFile);
      formData.append('title', musicForm.title);
      formData.append('artist', musicForm.artist);
      if (musicForm.duration) {
        formData.append('duration', musicForm.duration);
      }

      // Upload music
      await uploadMusic(formData);
      
      // Reset form on success
      setMusicForm({ title: '', artist: '', duration: '' });
      setMusicFile(null);
      setUploadStatus('Music uploaded successfully!');
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"][accept="audio/*"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh the music list
      fetchMusic();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error uploading music:', error);
      setUploadStatus(error.response?.data?.message || 'Failed to upload music. Please try again.');
      setTimeout(() => setUploadStatus(''), 5000);
    }
    setLoading(false);
  };

  const handleMusicChange = (e) => {
    setMusicForm({ ...musicForm, [e.target.name]: e.target.value });
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile Picture', icon: '👤' },
    { id: 'music', label: 'Music Management', icon: '🎵' },
    { id: 'content', label: 'Content Stats', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600">Welcome back! Manage your portfolio content here.</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="group px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-2">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <span className="text-lg mr-2">{tab.icon}</span>
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-200 mb-2">Quick Actions</h2>
                <p className="text-gray-300">Manage your portfolio content</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/projects"
                  className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Projects</h3>
                      <p className="text-sm text-gray-600">Manage portfolio</p>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/skills"
                  className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Skills</h3>
                      <p className="text-sm text-gray-600">Add & manage skills</p>
                    </div>
                  </div>
                </a>

                <a
                  href="/images"
                  className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gallery</h3>
                      <p className="text-sm text-gray-600">Upload images</p>
                    </div>
                  </div>
                </a>

                <a
                  href="/contact"
                  className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact</h3>
                      <p className="text-sm text-gray-600">View messages</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Total Projects</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {projects.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Active portfolio items</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Music Tracks</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {musicList.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Background audio</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Gallery Images</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {images.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Visual portfolio</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Admin Status</p>
                    <p className="text-lg font-bold text-green-600">Active</p>
                    <p className="text-sm text-gray-500 mt-1">All systems online</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <MusicManagement 
            musicList={musicList} 
            onMusicChange={fetchMusic} 
          />
        )}

        {activeTab === 'content' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Content Analytics</h2>
              <p className="text-gray-600">Overview of your portfolio content performance</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Projects</h3>
                <p className="text-4xl font-bold text-blue-600 mb-2">{projects.length}</p>
                <p className="text-sm text-blue-700">Portfolio showcases</p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl border border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Music</h3>
                <p className="text-4xl font-bold text-purple-600 mb-2">{musicList.length}</p>
                <p className="text-sm text-purple-700">Audio experiences</p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border border-green-200">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Images</h3>
                <p className="text-4xl font-bold text-green-600 mb-2">{images.length}</p>
                <p className="text-sm text-green-700">Visual assets</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Picture</h2>
              <p className="text-gray-600">Update your profile picture</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {profilePicture ? (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-600 shadow-lg hover:shadow-xl hover:brightness-110 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center shadow-md hover:shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 17.232a4 4 0 01-6.464 0M6 12a9 9 0 0118 0 9 9 0 01-18 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-800 mb-3">Upload New Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={async () => {
                  if (!profilePicture) {
                    setProfileUploadStatus('Please select a file first.');
                    setTimeout(() => setProfileUploadStatus(''), 3000);
                    return;
                  }
                  
                  setProfileLoading(true);
                  setProfileUploadStatus('');
                  try {
                    const formData = new FormData();
                    formData.append('image', profilePicture);
                    formData.append('description', 'Profile Picture');
                    
                    await uploadProfilePicture(formData);
                    setProfileUploadStatus('Profile picture updated successfully!');
                    setProfilePicture(null); // Reset file input
                    setTimeout(() => {
                      setProfileUploadStatus('');
                    }, 3000);
                  } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    setProfileUploadStatus('Error updating profile picture. Please try again.');
                    setTimeout(() => {
                      setProfileUploadStatus('');
                    }, 3000);
                  }
                  setProfileLoading(false);
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
                disabled={profileLoading || !profilePicture}
              >
                {profileLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Update Profile Picture
                  </span>
                )}
              </button>
            </div>

            {profileUploadStatus && (
              <div className="mt-4 text-center">
                <p className={`text-sm ${profileUploadStatus.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                  {profileUploadStatus}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;