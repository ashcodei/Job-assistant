import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';

// Icons
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { hasResume, isProcessing } = useResume();
  const location = useLocation();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Navigation items
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Applications', path: '/dashboard/applications', icon: BriefcaseIcon },
    { name: 'Resume', path: '/dashboard/resume', icon: DocumentTextIcon },
    { name: 'Resume Insights', path: '/dashboard/resume/insights', icon: SparklesIcon },
    { name: 'Profile', path: '/dashboard/profile', icon: UserIcon },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* BACKDROP for mobile only (dark overlay when sidebar is open) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0   /* Always show on large screens */
        `}
      >
        <div className="flex items-center justify-center h-16 px-6 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-md">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">JobsAI</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="mt-5 px-4">
          <div className="space-y-1">
            {navigation.map(item => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                  
                  {/* Show badge for Resume Insights if needed */}
                  {item.path === '/dashboard/resume/insights' && hasResume && (
                    <span className="ml-auto p-1">
                      <SparklesIcon className="h-4 w-4 text-primary-400 animate-pulse" />
                    </span>
                  )}
                  
                  {/* Show processing indicator for Resume if processing */}
                  {item.path === '/dashboard/resume' && isProcessing && (
                    <span className="ml-auto flex h-5 w-5 p-1 items-center justify-center">
                      <span className="h-4 w-4 rounded-full bg-warning-500 animate-pulse"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* User Profile Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-full text-white font-bold text-lg">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email || ''}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT, SHIFTED RIGHT ON LARGE SCREENS */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* TOP NAV */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm lg:px-6">
          {/* Mobile menu button */}
          <button
            className="p-2 text-gray-500 lg:hidden focus:outline-none"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
          
          {/* Page Title - Mobile */}
          <div className="lg:hidden">
            <h1 className="text-lg font-medium text-gray-900">
              {navigation.find(item =>
                item.path === location.pathname ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
              )?.name || 'Dashboard'}
            </h1>
          </div>
          
          {/* Right Navigation (e.g., Notifications) */}
          <div className="flex items-center space-x-4">
            <button
              className="p-1.5 text-gray-500 bg-gray-100 rounded-full hover:text-gray-700 focus:outline-none"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 bg-white border-t">
          <div className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} JobsAI. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
