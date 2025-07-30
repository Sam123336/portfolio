import { useState, useEffect, createContext, useContext } from 'react';
import { loginUser, registerUser, registerAdmin as registerAdminAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting login with credentials:', { username: credentials.username });
      const response = await loginUser(credentials);
      console.log('Login response:', response);
      
      if (response && response.token && response.user) {
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, ...response };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error in useAuth:', error);
      setError(error.message || 'Login failed');
      // Clear any existing auth data on error
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      return await registerUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (adminData) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting admin registration with data:', { 
        username: adminData.username, 
        email: adminData.email,
        portfolioData: adminData.portfolioData 
      });
      
      const response = await registerAdminAPI(adminData);
      console.log('Admin registration response:', response);
      
      if (response && response.token && response.user) {
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Return the response with portfolio URL for the success screen
        return { 
          success: true, 
          portfolioUrl: response.portfolioUrl,
          ...response 
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Admin registration error in useAuth:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      registerAdmin,
      logout, 
      loading,
      error,
      isLoggedIn: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};