import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Steps for the onboarding process
  const steps = [
    {
      title: 'Welcome to JobsAI!',
      description: 'Your AI-powered job application assistant',
      content: (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary-100 rounded-full mb-6">
            <SparklesIcon className="h-12 w-12 text-primary-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-md text-center mb-8">
            We're excited to help you streamline your job application process. Let's set up your account to get started!
          </p>
          <img
            src="https://source.unsplash.com/random/800x600/?office"
            alt="Job search illustration"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      )
    },
    {
      title: 'Create an account',
      description: 'Sign up to store your resume and track applications',
      content: (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary-100 rounded-full mb-6">
            <svg className="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {isAuthenticated ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-2" />
                <h3 className="text-xl font-medium text-gray-900">You're signed in!</h3>
              </div>
              <p className="text-gray-600 mb-4">
                You're already signed in as {currentUser?.name || 'User'}.
              </p>
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Continue to next step
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <p className="text-lg text-gray-600 mb-8 text-center">
                Create an account to save your resume and track your job applications across devices.
              </p>
              
              <div className="space-y-4">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Create an account
                </Link>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Upload your resume',
      description: 'Let AI analyze your resume for better suggestions',
      content: (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary-100 rounded-full mb-6">
            <DocumentTextIcon className="h-12 w-12 text-primary-600" />
          </div>
          
          <p className="text-lg text-gray-600 max-w-md text-center mb-8">
            Upload your resume so our AI can analyze it and provide accurate suggestions when filling out job applications.
          </p>
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full max-w-md">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Our AI will securely parse your resume to help auto-fill job applications.
            </p>
            
            <Link
              to="/dashboard/resume"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Upload Your Resume
            </Link>
          </div>
        </div>
      )
    },
    {
      title: 'Install Chrome Extension',
      description: 'Auto-fill job applications as you browse',
      content: (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary-100 rounded-full mb-6">
            <svg className="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <p className="text-lg text-gray-600 max-w-md text-center mb-8">
            Our Chrome extension detects job application forms and helps you fill them out automatically.
          </p>
          
          <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
            <div className="flex items-start mb-4">
              <div className="shrink-0">
                <img src="/chrome-icon.png" alt="Chrome" className="h-12 w-12" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Chrome Extension</h3>
                <p className="text-gray-500">Already installed</p>
              </div>
              <CheckCircleIcon className="ml-auto h-8 w-8 text-green-500" />
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Features</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Auto-detect job application forms
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  AI-powered form filling
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Works on most job sites
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'All set!',
      description: "You're ready to start applying for jobs",
      content: (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">You're all set!</h3>
          
          <p className="text-lg text-gray-600 max-w-md text-center mb-8">
            You've completed the onboarding process and are ready to start applying for jobs with AI assistance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <Link
              to="/dashboard"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Dashboard
            </Link>
            
            <Link
              to="/dashboard/applications"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse Applications
            </Link>
          </div>
        </div>
      )
    }
  ];
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip to dashboard
  const handleSkip = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-primary-600 flex items-center justify-center rounded-md">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-primary-600">JobsAI</span>
              </div>
            </div>
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Skip to Dashboard
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center py-4">
            <ol className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      index < currentStep
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : index === currentStep
                        ? 'border-primary-600 text-primary-600'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`ml-4 h-0.5 w-8 ${
                        index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {/* Step Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-white">
              <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
              <p className="mt-1 text-primary-100">{steps[currentStep].description}</p>
            </div>
            
            {/* Step Content */}
            <div className="px-6 py-8">
              {steps[currentStep].content}
            </div>
            
            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Back
              </button>
              
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  'Finish'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} JobsAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;