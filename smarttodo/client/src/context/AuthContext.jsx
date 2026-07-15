// src/context/AuthContext.jsx - Authentication Context
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('smarttodo_token');
      const savedUser = localStorage.getItem('smarttodo_user');
      if (token && savedUser) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch {
          localStorage.removeItem('smarttodo_token');
          localStorage.removeItem('smarttodo_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('smarttodo_token', token);
    localStorage.setItem('smarttodo_user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue logout even if API call fails
    }
    localStorage.removeItem('smarttodo_token');
    localStorage.removeItem('smarttodo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
