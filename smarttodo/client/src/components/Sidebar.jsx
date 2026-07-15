// src/components/Sidebar.jsx - Minimalist sidebar
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineClock,
  HiOutlineUser, HiOutlineChevronLeft, HiOutlineX
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { path: '/todos', icon: HiOutlineClipboardList, label: 'Todos' },
  { path: '/history', icon: HiOutlineClock, label: 'History' },
  { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

const Sidebar = ({ isOpen, isCollapsed, onToggle, onClose }) => {
  const sidebarWidth = isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          width: isOpen && window.innerWidth < 768 ? 'var(--sidebar-width)' : sidebarWidth,
          paddingTop: 'var(--navbar-height)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <div className="flex items-center justify-end p-2 md:hidden">
          <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <HiOutlineX size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group text-xs font-medium
              `}
              style={({ isActive }) => ({
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
              })}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {(!isCollapsed || (isOpen && window.innerWidth < 768)) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <HiOutlineChevronLeft
              size={16}
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
            {!isCollapsed && <span className="ml-2">Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
