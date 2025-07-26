import { useState, useEffect, createContext, useContext } from 'react';
import { loginUser, registerUser } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      // Clear any existing auth data on error
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
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