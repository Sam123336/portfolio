import { useState, useEffect } from 'react';
import { getCV, uploadCV, getAllCVs, setActiveCV, deleteCV } from '../utils/api';

export const useCV = (userId = null) => {
  const [cv, setCV] = useState(null);
  const [allCVs, setAllCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCV = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCV(userId);
      setCV(data);
    } catch (err) {
      console.error('Error fetching CV:', err);
      setError(err.response?.data?.message || 'Failed to fetch CV');
      setCV(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCVs = async () => {
    try {
      const data = await getAllCVs();
      setAllCVs(data);
    } catch (err) {
      console.error('Error fetching all CVs:', err);
      setError(err.response?.data?.message || 'Failed to fetch CVs');
    }
  };

  const handleUploadCV = async (formData) => {
    try {
      setUploading(true);
      setError(null);
      const result = await uploadCV(formData);
      await fetchCV(); // Refresh current CV
      await fetchAllCVs(); // Refresh all CVs
      return result;
    } catch (err) {
      console.error('Error uploading CV:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload CV';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (cvId) => {
    try {
      setError(null);
      await setActiveCV(cvId);
      await fetchCV(); // Refresh current CV
      await fetchAllCVs(); // Refresh all CVs
    } catch (err) {
      console.error('Error setting active CV:', err);
      const errorMessage = err.response?.data?.message || 'Failed to set active CV';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteCV = async (cvId) => {
    try {
      setError(null);
      await deleteCV(cvId);
      await fetchCV(); // Refresh current CV
      await fetchAllCVs(); // Refresh all CVs
    } catch (err) {
      console.error('Error deleting CV:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete CV';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCV();
  }, [userId]);

  return {
    cv,
    allCVs,
    loading,
    uploading,
    error,
    fetchCV,
    fetchAllCVs,
    uploadCV: handleUploadCV,
    setActiveCV: handleSetActive,
    deleteCV: handleDeleteCV,
    refetch: fetchCV
  };
};