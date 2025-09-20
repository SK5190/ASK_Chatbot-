import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Set up axios interceptor to handle 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          console.log('401 Unauthorized - logging out user');
          setUser(null);
          localStorage.removeItem('ask-bot-user');
          localStorage.removeItem('ask-bot-chats');
          localStorage.removeItem('ask-bot-messages');
        }
        return Promise.reject(error);
      }
    );
    
    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First, check if we have user data in localStorage
      const savedUser = localStorage.getItem('ask-bot-user');
      
      if (savedUser) {
        // We have user data, but we need to verify the token is still valid
        try {
          // Make a request to a protected endpoint to verify the token
          await axios.get('/chat');
          // If successful, the token is valid
          setUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } catch (tokenError) {
          console.log('Token expired or invalid:', tokenError.response?.status);
          // Token is invalid, clear localStorage
          localStorage.removeItem('ask-bot-user');
          localStorage.removeItem('ask-bot-chats');
          localStorage.removeItem('ask-bot-messages');
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
      // No saved user data, user is not authenticated
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.log('Error checking auth status:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      setUser(response.data.user);
      
      // Save user data to localStorage for persistence
      localStorage.setItem('ask-bot-user', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post('/auth/register', {
        fullName: { firstName, lastName },
        email,
        password
      });
      setUser(response.data.user);
      
      // Save user data to localStorage for persistence
      localStorage.setItem('ask-bot-user', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('ask-bot-user');
    // Clear other app data
    localStorage.removeItem('ask-bot-chats');
    localStorage.removeItem('ask-bot-messages');
    // Clear cookies by making a logout request if you have that endpoint
    // or just clear local state
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

