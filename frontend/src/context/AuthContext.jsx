import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('connecthub_token');
      if (token) {
        try {
          // Query current profile info using stored JWT token
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            purgeLocalAuth();
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          purgeLocalAuth();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const purgeLocalAuth = () => {
    setUser(null);
    localStorage.removeItem('connecthub_token');
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data && response.token) {
        localStorage.setItem('connecthub_token', response.token);
        setUser(response.data);
        return { success: true };
      } else {
        throw new Error('Server returned an invalid authentication package.');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await authService.register({ name, username, email, password });
      if (response.success && response.data && response.token) {
        localStorage.setItem('connecthub_token', response.token);
        setUser(response.data);
        return { success: true };
      } else {
        throw new Error('Server returned an invalid registration package.');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Failed to notify backend of logout:', error);
    } finally {
      purgeLocalAuth();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
