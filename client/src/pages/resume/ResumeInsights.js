import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  FireIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useResume } from '../../contexts/ResumeContext';

const ResumeInsights = () => {
  const { hasResume, isProcessing, resumeData, fetchResumeInsights } = useResume();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: true,
    suggestions: true,
    keywordOptimization: true,
  });
  
  // Fetch insights when page loads
  useEffect(() => {
    if (hasResume && !isProcessing) {
      loadInsights();
    } else {
      setLoading(false);
    }
  }, [hasResume, isProcessing]);
  
  // Load insights
  const loadInsights = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
        const data = await fetchResumeInsights(forceRefresh);
        if (data?.strengths) {
          // Looks like a success
          setInsights(data);
          setError(null);
        } else {
          // Looks like an error
          setInsights(null);
          setError(data?.message || 'Unknown error');
        }
      } catch (err) {
        setInsights(null);
        setError('Failed to load resume insights. Please try again later.');
      }      
  };
  
  // Refresh insights
  const handleRefresh = () => {
    loadInsights(true);
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        {/* Maybe a “Try again” button here */}
      </div>
    );
  }
  
  // Render not ready state
  // Render not ready state
  if (!hasResume) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume Insights</h1>
          <p className="text-gray-600 mt-1">
            AI-powered analysis to help optimize your resume
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="text-center py-8">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume Found</h3>
            <p className="text-gray-600 mb-6">
              You need to upload your resume before we can provide insights.
            </p>
            <Link
              to="/dashboard/resume"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Upload Resume
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  //  processing state
  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume Insights</h1>
          <p className="text-gray-600 mt-1">
            AI-powered analysis to help optimize your resume
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Your Resume</h3>
            <p className="text-gray-600">
              We're analyzing your resume. This may take a few minutes.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Insights</h1>
          <p className="text-gray-600 mt-1">
            AI-powered analysis to help optimize your resume
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            {refreshing ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh Insights
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && !refreshing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Analyzing Your Resume</h3>
            <p className="text-gray-600">
              Our AI is analyzing your resume to provide insights...
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Insights</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Insights Content */}
      {!loading && !error && insights && !Array.isArray(insights.strengths) && (
        <>
          {/* Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-full">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-900">Resume Analysis Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-success-100 rounded-full">
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Strengths Identified</h3>
                  <p className="text-lg font-semibold text-gray-900">{insights.strengths?.length || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-warning-100 rounded-full">
                  <XCircleIcon className="w-5 h-5 text-warning-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Areas for Improvement</h3>
                  <p className="text-lg font-semibold text-gray-900">{insights.weaknesses?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-full">
                  <LightBulbIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Improvement Suggestions</h3>
                  <p className="text-lg font-semibold text-gray-900">{insights.suggestions?.length || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-success-100 rounded-full">
                  <FireIcon className="w-5 h-5 text-success-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Keywords to Add</h3>
                  <p className="text-lg font-semibold text-gray-900">{insights.keywordOptimization?.length || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Strengths Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <button
              onClick={() => toggleSection('strengths')}
              className="w-full flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-full">
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                </div>
                <h2 className="ml-3 text-lg font-semibold text-gray-900">Resume Strengths</h2>
              </div>
              {expandedSections.strengths ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.strengths && (
              <div className="mt-4 pl-10">
                {insights.strengths && insights.strengths.length > 0 ? (
                  <ul className="space-y-3">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No specific strengths identified.</p>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Weaknesses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <button
              onClick={() => toggleSection('weaknesses')}
              className="w-full flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-full">
                  <XCircleIcon className="w-5 h-5 text-warning-600" />
                </div>
                <h2 className="ml-3 text-lg font-semibold text-gray-900">Areas for Improvement</h2>
              </div>
              {expandedSections.weaknesses ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.weaknesses && (
              <div className="mt-4 pl-10">
                {insights.weaknesses && insights.weaknesses.length > 0 ? (
                  <ul className="space-y-3">
                    {insights.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <XCircleIcon className="h-5 w-5 text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No specific weaknesses identified.</p>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Suggestions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <button
              onClick={() => toggleSection('suggestions')}
              className="w-full flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-full">
                  <LightBulbIcon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="ml-3 text-lg font-semibold text-gray-900">Improvement Suggestions</h2>
              </div>
              {expandedSections.suggestions ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.suggestions && (
              <div className="mt-4 pl-10">
                {insights.suggestions && insights.suggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {insights.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <LightBulbIcon className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No specific suggestions available.</p>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Keyword Optimization Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <button
              onClick={() => toggleSection('keywordOptimization')}
              className="w-full flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-full">
                  <FireIcon className="w-5 h-5 text-success-600" />
                </div>
                <h2 className="ml-3 text-lg font-semibold text-gray-900">Keyword Optimization</h2>
              </div>
              {expandedSections.keywordOptimization ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.keywordOptimization && (
              <div className="mt-4 pl-10">
                <p className="text-gray-700 mb-3">
                  Including these industry-relevant keywords can help your resume pass through Applicant Tracking Systems (ATS) and catch recruiters' attention.
                </p>
                
                {insights.keywordOptimization && insights.keywordOptimization.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {insights.keywordOptimization.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No keyword suggestions available.</p>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-end mb-6">
            <Link
              to="/dashboard/resume"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Update Resume
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              {refreshing ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Insights
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeInsights;