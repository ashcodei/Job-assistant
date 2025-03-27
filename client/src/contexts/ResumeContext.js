import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Create resume context
const ResumeContext = createContext();

// Resume provider component
export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [resumeInsights, setResumeInsights] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { currentUser, isAuthenticated } = useAuth();
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  // Load resume status when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser?.hasResume) {
      fetchResumeStatus();
    } else {
      // Reset data if user is not authenticated or doesn't have resume
      setResumeData(null);
      setResumeInfo(null);
      setResumeInsights(null);
      setIsProcessing(false);
    }
  }, [isAuthenticated, currentUser]);
  
  // Fetch resume status
  const fetchResumeStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resume/status');
      
      setResumeInfo(response.data.resume);
      setIsProcessing(!response.data.resume.isProcessed);
      
      if (response.data.resume.isProcessed) {
        await fetchResumeData();
      }
      
      return response.data.resume;
    } catch (error) {
      console.error('Fetch resume status error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch resume data
  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resume/data');
      
      setResumeData(response.data.resumeData);
      return response.data.resumeData;
    } catch (error) {
      console.error('Fetch resume data error:', error);
      
      if (error.response && error.response.data.isProcessing) {
        setIsProcessing(true);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Upload resume
  const uploadResume = async (file) => {
    try {
      setLoading(true);
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResumeInfo(response.data.resume);
      
      toast.success('Resume uploaded successfully! Processing in progress...');
      
      // Start polling for resume processing status
      startPollingResumeStatus();
      
      return response.data.resume;
    } catch (error) {
      console.error('Upload resume error:', error);
      let errorMessage = 'Failed to upload resume. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      setIsProcessing(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Poll for resume processing status
  const startPollingResumeStatus = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get('/api/resume/status');
        
        if (response.data.resume.isProcessed) {
          clearInterval(pollInterval);
          setIsProcessing(false);
          setResumeInfo(response.data.resume);
          toast.success('Resume processed successfully!');
          
          // Fetch the processed resume data
          await fetchResumeData();
        } else if (response.data.resume.processingError) {
          clearInterval(pollInterval);
          setIsProcessing(false);
          setResumeInfo(response.data.resume);
          toast.error(`Resume processing failed: ${response.data.resume.processingError}`);
        }
      } catch (error) {
        console.error('Resume status polling error:', error);
      }
    }, 5000); // Poll every 5 seconds
    
    // Clear interval after 5 minutes (to avoid infinite polling)
    setTimeout(() => {
      clearInterval(pollInterval);
      
      // If still processing after timeout, update UI
      if (isProcessing) {
        setIsProcessing(false);
        toast.error('Resume processing is taking longer than expected. Please check back later.');
      }
    }, 30 * 1000);
  };
  
  // Delete resume
  const deleteResume = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/resume');
      
      setResumeData(null);
      setResumeInfo(null);
      setResumeInsights(null);
      setIsProcessing(false);
      
      toast.success('Resume deleted successfully!');
      return true;
    } catch (error) {
      console.error('Delete resume error:', error);
      let errorMessage = 'Failed to delete resume. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch resume insights
  const fetchResumeInsights = async (forceRefresh = false) => {
    // Return cached insights if available and no refresh requested
    if (resumeInsights && !forceRefresh) {
      return resumeInsights;
    }
    
    try {
      setLoading(true);
      const response = await axios.get('/api/suggestions/resume-insights');
      
      setResumeInsights(response.data.insights);
      return response.data.insights;
    } catch (error) {
      console.error('Fetch resume insights error:', error);
      let errorMessage = 'Failed to fetch resume insights. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
        
        if (error.response.data.needsResume) {
          errorMessage = 'Resume required to generate insights.';
        }
      }
      
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Download resume
  const downloadResume = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resume/download', {
        responseType: 'blob'
      });
      
      // Create blob URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resumeInfo?.fileName || 'resume');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Download resume error:', error);
      let errorMessage = 'Failed to download resume. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value = {
    resumeData,
    resumeInfo,
    resumeInsights,
    isProcessing,
    loading,
    hasResume: !!resumeInfo,
    uploadResume,
    fetchResumeStatus,
    fetchResumeData,
    deleteResume,
    fetchResumeInsights,
    downloadResume
  };
  
  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use resume context
export const useResume = () => {
  return useContext(ResumeContext);
};