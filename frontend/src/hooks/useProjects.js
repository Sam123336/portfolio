import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../utils/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (projectData) => {
    const newProject = await createProject(projectData);
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const editProject = async (id, projectData) => {
    const updated = await updateProject(id, projectData);
    setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, addProject, editProject, removeProject };
};
