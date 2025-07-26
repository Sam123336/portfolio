import React, { useState } from 'react';
import { uploadMusic as uploadMusicApi, deleteMusic as deleteMusicApi, setDefaultMusic as setDefaultMusicApi } from '../utils/api';

const MusicManagement = ({ musicList, onMusicChange }) => {
  const [musicForm, setMusicForm] = useState({ title: '', artist: '', duration: '' });
  const [musicFile, setMusicFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const handleMusicUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus('');
    
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
      await uploadMusicApi(formData);
      
      // Reset form on success
      setMusicForm({ title: '', artist: '', duration: '' });
      setMusicFile(null);
      setUploadStatus('Music uploaded successfully!');
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"][accept="audio/*"]');
      if (fileInput) fileInput.value = '';
      
      // Call success callback to refresh parent component
      if (onMusicChange) onMusicChange();
      
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

  const handleSetDefault = async (musicId) => {
    setActionLoading(prev => ({ ...prev, [`default_${musicId}`]: true }));
    try {
      await setDefaultMusicApi(musicId);
      if (onMusicChange) onMusicChange();
      setUploadStatus('Default music set successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error setting default music:', error);
      setUploadStatus('Failed to set default music. Please try again.');
      setTimeout(() => setUploadStatus(''), 5000);
    }
    setActionLoading(prev => ({ ...prev, [`default_${musicId}`]: false }));
  };

  const handleDeleteMusic = async (musicId) => {
    if (!window.confirm('Are you sure you want to delete this music track? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`delete_${musicId}`]: true }));
    try {
      await deleteMusicApi(musicId);
      if (onMusicChange) onMusicChange();
      setUploadStatus('Music deleted successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error deleting music:', error);
      setUploadStatus('Failed to delete music. Please try again.');
      setTimeout(() => setUploadStatus(''), 5000);
    }
    setActionLoading(prev => ({ ...prev, [`delete_${musicId}`]: false }));
  };

  return (
    <div className="space-y-8">
      {/* Music Upload Form */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload New Music</h2>
          <p className="text-gray-600">Add background music tracks for your portfolio</p>
        </div>
        
        <form onSubmit={handleMusicUpload} className="grid gap-8 md:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Track Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={musicForm.title}
              onChange={handleMusicChange}
              placeholder="Ambient Background Track"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Artist Name <span className="text-red-500">*</span>
            </label>
            <input
              name="artist"
              value={musicForm.artist}
              onChange={handleMusicChange}
              placeholder="Artist or composer name"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Duration (seconds, optional)</label>
            <input
              name="duration"
              type="number"
              value={musicForm.duration}
              onChange={handleMusicChange}
              placeholder="180"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Music File <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setMusicFile(e.target.files[0])}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Supports: MP3, WAV, FLAC, AAC, M4A, OGG (max 50MB)
              </p>
            </div>
            {musicFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 font-medium">
                  📁 Selected: {musicFile.name}
                </p>
                <p className="text-xs text-green-600">
                  Size: {(musicFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className="md:col-span-2">
              <div className={`p-4 rounded-2xl ${
                uploadStatus.includes('successfully') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <p className="font-medium">{uploadStatus}</p>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !musicForm.title || !musicForm.artist || !musicFile}
              className="group w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading Music...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Music File
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Current Music Library */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Music Library Management</h2>
          <p className="text-gray-600">Manage your uploaded background tracks, set default, and delete tracks</p>
        </div>
        
        {musicList && musicList.length > 0 ? (
          <div className="space-y-4">
            {musicList.map((track) => (
              <div key={track._id} className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${track.isDefault ? 'bg-gradient-to-r from-gold-500 to-yellow-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {track.isDefault ? (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900 text-lg">{track.title}</h3>
                        {track.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{track.artist}</p>
                      {track.duration && (
                        <p className="text-sm text-gray-500">Duration: {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <audio controls className="h-10">
                      <source src={track.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    {/* Set Default Button */}
                    {!track.isDefault && (
                      <button
                        onClick={() => handleSetDefault(track._id)}
                        disabled={actionLoading[`default_${track._id}`]}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
                      >
                        {actionLoading[`default_${track._id}`] ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Set Default'
                        )}
                      </button>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMusic(track._id)}
                      disabled={actionLoading[`delete_${track._id}`]}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
                    >
                      {actionLoading[`delete_${track._id}`] ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No music tracks yet</h3>
            <p className="text-gray-600">Upload your first background track to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicManagement;