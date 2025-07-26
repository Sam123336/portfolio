import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api } from '../utils/api';

export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const isAdmin = !!user;

  // Fetch all skills
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError(err.response?.data?.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  // Fetch skill categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/skills/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Add a new skill (admin only)
  const addSkill = async (skillData) => {
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/skills', skillData);
      setSkills(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding skill:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a skill (admin only)
  const updateSkill = async (id, skillData) => {
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      setSkills(prev => prev.map(skill => 
        skill._id === id ? response.data : skill
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating skill:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a skill (admin only)
  const deleteSkill = async (id) => {
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/skills/${id}`);
      setSkills(prev => prev.filter(skill => skill._id !== id));
    } catch (err) {
      console.error('Error deleting skill:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search skills
  const searchSkills = async (query) => {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await api.get(`/skills/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (err) {
      console.error('Error searching skills:', err);
      return [];
    }
  };

  // Get skills by category
  const getSkillsByCategory = async (category) => {
    try {
      const response = await api.get(`/skills/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching skills by category:', err);
      return [];
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  return {
    skills,
    categories,
    loading,
    error,
    isAdmin,
    fetchSkills,
    fetchCategories,
    addSkill,
    updateSkill,
    deleteSkill,
    searchSkills,
    getSkillsByCategory
  };
};