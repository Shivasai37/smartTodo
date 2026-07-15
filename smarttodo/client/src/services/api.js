// src/services/api.js - Axios API service
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('smarttodo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smarttodo_token');
      localStorage.removeItem('smarttodo_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me')
};

// Todos API
export const todosAPI = {
  getAll: (params) => API.get('/todos', { params }),
  create: (data) => API.post('/todos', data),
  update: (id, data) => API.put(`/todos/${id}`, data),
  delete: (id) => API.delete(`/todos/${id}`)
};

// History API
export const historyAPI = {
  getAll: (params) => API.get('/history', { params }),
  add: (data) => API.post('/history', data),
  restore: (id) => API.put(`/history/restore/${id}`),
  deletePermanent: (id) => API.delete(`/history/${id}`)
};

export default API;
