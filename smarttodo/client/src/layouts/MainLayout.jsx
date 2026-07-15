// src/layouts/MainLayout.jsx - Apple Layout Offset
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--colors-canvas-parchment)' }}>
      {/* Top Double Navbar (44px + 52px = 96px total height) */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-[96px]">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleCollapse}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className="flex-1 min-w-0 transition-all duration-300"
          style={{
            marginLeft: isSidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
            background: 'var(--colors-canvas-parchment)',
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
