// filepath: /home/sambit/Documents/portfolio-main/frontend/src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

// Generate a session ID for tracking
const generateSessionId = () => {
  const stored = sessionStorage.getItem('portfolio_session_id');
  if (stored) return stored;
  
  const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  sessionStorage.setItem('portfolio_session_id', sessionId);
  return sessionId;
};

export const useAnalytics = () => {
  const [sessionId] = useState(generateSessionId());
  const [pageStartTime, setPageStartTime] = useState(Date.now());

  // Track analytics event
  const trackEvent = useCallback(async (type, data = {}) => {
    try {
      await api.post('/analytics/track', {
        type,
        sessionId,
        ...data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  }, [sessionId]);

  // Track page view
  const trackPageView = useCallback((page) => {
    setPageStartTime(Date.now());
    trackEvent('page_view', { page });
  }, [trackEvent]);

  // Track page leave (with duration)
  const trackPageLeave = useCallback((page) => {
    const duration = Date.now() - pageStartTime;
    trackEvent('page_view', { page, duration });
  }, [trackEvent, pageStartTime]);

  // Track project click
  const trackProjectClick = useCallback((projectId, projectTitle) => {
    trackEvent('project_click', { 
      projectId, 
      metadata: { projectTitle } 
    });
  }, [trackEvent]);

  // Track external link click
  const trackExternalLink = useCallback((url, source) => {
    trackEvent('external_link_click', { 
      metadata: { url, source } 
    });
  }, [trackEvent]);

  // Track contact form events
  const trackContactForm = useCallback((action) => {
    trackEvent(`contact_form_${action}`);
  }, [trackEvent]);

  // Track image view
  const trackImageView = useCallback((imageId) => {
    trackEvent('image_view', { imageId });
  }, [trackEvent]);

  // Track skill view
  const trackSkillView = useCallback((skillId) => {
    trackEvent('skill_view', { skillId });
  }, [trackEvent]);

  return {
    sessionId,
    trackEvent,
    trackPageView,
    trackPageLeave,
    trackProjectClick,
    trackExternalLink,
    trackContactForm,
    trackImageView,
    trackSkillView
  };
};

// Hook for fetching analytics dashboard data (admin only)
export const useAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  const fetchDashboardData = useCallback(async (period = '7d') => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/dashboard?period=${period}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRealTimeData = useCallback(async () => {
    try {
      const response = await api.get('/analytics/realtime');
      setRealTimeData(response.data);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
    }
  }, []);

  const updateContactStatus = useCallback(async (contactId, status) => {
    try {
      await api.patch(`/analytics/contacts/${contactId}/status`, { status });
      // Refresh dashboard data after updating
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating contact status:', err);
      throw err;
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    realTimeData,
    fetchDashboardData,
    fetchRealTimeData,
    updateContactStatus
  };
};

export default useAnalytics;