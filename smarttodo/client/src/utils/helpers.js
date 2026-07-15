// src/utils/helpers.js - Utility helper functions

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Get today's date formatted
export const getTodayDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Priority colors
export const getPriorityColor = (priority) => {
  const colors = {
    high: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: 'High' },
    medium: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'Medium' },
    low: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: 'Low' }
  };
  return colors[priority] || colors.medium;
};

// Category options
export const categories = [
  'general', 'work', 'personal', 'shopping', 'health', 'finance', 'education', 'travel'
];

// Priority options
export const priorities = ['high', 'medium', 'low'];

// Truncate text
export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};
