import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  SparklesIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ClockIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0">
          <svg
            className="absolute left-0 bottom-0 h-full w-full transform"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              opacity="0.05" 
              d="M0,224L48,192C96,160,192,96,288,96C384,96,480,160,576,186.7C672,213,768,203,864,170.7C960,139,1056,85,1152,96C1248,107,1344,181,1392,218.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
              fill="white" 
            />
            <path 
              opacity="0.1" 
              d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,208C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
              fill="white" 
            />
          </svg>
        </div>

        <div className="relative px-6 py-16 sm:px-8 sm:py-24 lg:py-32 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Apply for jobs <br /> 
                <span className="text-yellow-300">with AI confidence</span>
              </h1>
              <p className="mt-6 text-xl text-primary-100 max-w-3xl">
                JobsAI automates job applications with AI-powered form filling, saving you time and helping you land more interviews.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-block px-6 py-3 rounded-md bg-white text-primary-700 text-base font-medium shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-200"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-block px-6 py-3 rounded-md bg-white text-primary-700 text-base font-medium shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-200"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/login"
                      className="inline-block px-6 py-3 rounded-md bg-primary-700 text-white text-base font-medium border border-primary-300 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="relative mx-auto w-full max-w-md p-4 bg-white rounded-2xl shadow-xl">
                <div className="p-2 bg-primary-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="ml-2 text-xs text-gray-500">Job Application</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Full Name</div>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm">John Smith</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-green-600">✓ Auto-filled with high confidence</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Email Address</div>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm">john.smith@example.com</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-green-600">✓ Auto-filled with high confidence</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Work Experience</div>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm">5+ years of experience in software development</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-yellow-600">⚠️ Please review before submitting</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="inline-block px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg">Apply with JobsAI</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg animate-pulse">
                  <SparklesIcon className="h-6 w-6" />
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                <div className="text-primary-800 font-bold text-center text-sm leading-tight">
                  Save<br />Hours!
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Chrome Extension Promo */}
      <motion.div 
        className="bg-gray-50 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Chrome Extension</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Job Applications Made Effortless
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our Chrome extension automatically detects job application forms and fills them out for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative mx-auto max-w-md">
                <div className="relative shadow-xl rounded-2xl overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/GHrcf13bahU/800x600" 
                    alt="Browser with job application form" 
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 right-0 p-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <SparklesIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">JobsAI Assistant Active</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -left-4 bg-primary-600 text-white p-4 rounded-full shadow-lg">
                  <RocketLaunchIcon className="h-8 w-8" />
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-8">
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Instant Form Detection</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our extension automatically detects when you're filling out a job application and offers immediate assistance.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Powered Form Filling</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Using information from your resume, our AI automatically fills out form fields with high accuracy.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Save Hours of Time</h3>
                  <p className="mt-2 text-base text-gray-500">
                    No more repetitive typing. Complete job applications in minutes instead of hours.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
              >
                <a 
                  href="#" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Get Chrome Extension
                  <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Land Your Dream Job
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              JobsAI combines AI technology with practical tools to streamline your job search.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Parser</h3>
              <p className="text-gray-500 mb-4">
                Upload your resume once, and our AI will extract and organize all your information.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-500 mb-4">
                Our AI analyzes job applications to provide the most relevant information from your resume.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Application Tracker</h3>
              <p className="text-gray-500 mb-4">
                Keep track of all your job applications, interviews, and offers in one organized dashboard.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <LightBulbIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Insights</h3>
              <p className="text-gray-500 mb-4">
                Get AI-powered insights to optimize your resume and increase your chances of landing interviews.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interview Manager</h3>
              <p className="text-gray-500 mb-4">
                Schedule and prepare for interviews with reminders, notes, and post-interview feedback.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <RocketLaunchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">One-Click Apply</h3>
              <p className="text-gray-500 mb-4">
                Fill out entire job applications with a single click, saving you time and reducing stress.
              </p>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                Learn more
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Testimonials Section */}
      <motion.div 
        className="bg-gray-50 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                  A
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Alex T.</h3>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "JobsAI saved me so much time during my job hunt. I applied to 50+ positions in just a few days, and landed 8 interviews!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                  J
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Jamie K.</h3>
                  <p className="text-sm text-gray-500">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "The Chrome extension is like magic! It automatically filled out even the most complex application forms with impressive accuracy."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                  S
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Sam L.</h3>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "The resume insights feature helped me optimize my resume for each job I applied to. Within two weeks, I landed my dream job!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div 
        className="bg-primary-700"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to save time on job applications?</span>
              <span className="block text-primary-200">Get started with JobsAI today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-100">
              Start applying to jobs faster and more efficiently with our AI-powered assistant.
            </p>
          </motion.div>
          <motion.div className="mt-8 flex lg:mt-0 lg:flex-shrink-0" variants={itemVariants}>
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
              >
                Get started free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Learn more
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;