// src/components/Navbar.jsx - Exact Apple Double-bar Navigation
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMoon, HiOutlineSun,
  HiOutlineMenu, HiOutlineLogout, HiOutlineUser
} from 'react-icons/hi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get active path title for display in sub-nav
  const getPathTitle = () => {
    const path = location.pathname.replace('/', '');
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      {/* 1. Global Navigation Bar (Slim 44px Black Header) */}
      <div 
        className="w-full flex items-center justify-between px-6"
        style={{
          height: 'var(--navbar-height)',
          backgroundColor: 'var(--colors-surface-black)',
          color: 'var(--colors-body-on-dark)',
        }}
      >
        {/* Toggle Hamburger / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-lg hover:bg-neutral-800 transition-colors md:hidden text-white"
          >
            <HiOutlineMenu size={16} />
          </button>
          <span 
            onClick={() => navigate('/')}
            className="font-semibold text-xs tracking-tight cursor-pointer"
            style={{ fontFamily: 'SF Pro Text, sans-serif' }}
          >
            SmartTodo
          </span>
        </div>

        {/* Global Links */}
        <div className="hidden md:flex items-center gap-6 text-[12px] font-normal tracking-tight">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:opacity-80">Dashboard</span>
          <span onClick={() => navigate('/todos')} className="cursor-pointer hover:opacity-80">Todos</span>
          <span onClick={() => navigate('/history')} className="cursor-pointer hover:opacity-80">History</span>
          <span onClick={() => navigate('/profile')} className="cursor-pointer hover:opacity-80">Profile</span>
        </div>

        {/* Account and Theme */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <HiOutlineSun size={15} /> : <HiOutlineMoon size={15} />}
          </button>

          {/* Profile Dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=ffffff&color=000`}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-cover border border-neutral-700"
              />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 py-1 rounded-xl z-50 text-xs"
                  style={{
                    background: 'var(--colors-canvas)',
                    border: '1px solid var(--colors-hairline)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--colors-hairline)' }}>
                    <p className="font-semibold" style={{ color: 'var(--colors-ink)' }}>{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-neutral-800"
                    style={{ color: 'var(--colors-ink)' }}
                  >
                    <HiOutlineUser size={14} /> Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <HiOutlineLogout size={14} /> Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Bar (52px Frosted Glass) */}
      <div 
        className="w-full flex items-center justify-between px-6"
        style={{
          height: 'var(--sub-nav-height)',
          background: 'var(--colors-canvas-parchment)',
          opacity: 0.92,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--colors-hairline)',
        }}
      >
        <span 
          className="tagline-copy tracking-tight text-gray-900 dark:text-gray-100"
        >
          {getPathTitle()}
        </span>

        {/* Right side CTA text links/buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/todos')}
            className="button-primary text-xs"
          >
            Manage Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
