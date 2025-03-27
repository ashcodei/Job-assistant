import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { SparklesIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center mb-6">
              <SparklesIcon className="h-14 w-14 text-white" />
            </div>
          </div>
          
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>
        
        <motion.div
          className="mt-16 grid gap-y-4 grid-cols-2 sm:grid-cols-4 gap-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-medium text-gray-800">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                  Features
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-medium text-gray-800">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@jobsai.com" className="text-base text-gray-500 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-medium text-gray-800">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-medium text-gray-800">Account</h3>
            <ul className="mt-4 space-y-4">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-base text-gray-500 hover:text-gray-900">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/profile" className="text-base text-gray-500 hover:text-gray-900">
                      Settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-base text-gray-500 hover:text-gray-900">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-base text-gray-500 hover:text-gray-900">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;