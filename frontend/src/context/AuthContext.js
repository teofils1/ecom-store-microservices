import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const API_URL = 'http://localhost:8085/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, id, username, role } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode(token);
      const userData = { ...decoded, id, username, email, role };
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, id, username, email, role } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode(token);
      const userInfo = { ...decoded, id, username, email, role };
      setUser(userInfo);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userInfo;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user && user.role === 'ADMIN';

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
