import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  DocumentArrowUpIcon,
  DocumentIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useResume } from '../../contexts/ResumeContext';

const ResumeUpload = () => {
  const { resumeInfo, hasResume, isProcessing, loading, uploadResume, deleteResume, downloadResume } = useResume();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [processingError, setProcessingError] = useState(false);
  const [processingTimeout, setProcessingTimeout] = useState(false);
  const [processingTimeoutId, setProcessingTimeoutId] = useState(null);
  
  // Sync with isProcessing from context and handle timeout
  useEffect(() => {
    setLocalIsProcessing(isProcessing);
    
    // If resume is processing, set a timeout
    if (isProcessing) {
      // Clear any existing timeout
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
      
      // Set a new timeout (2 minutes)
      const timeoutId = setTimeout(() => {
        setProcessingTimeout(true);
        setLocalIsProcessing(false);
      }, 30 * 1000);
      
      setProcessingTimeoutId(timeoutId);
    } else {
      // Clear timeout if processing is complete
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
        setProcessingTimeoutId(null);
      }
    }
    
    return () => {
      // Clean up timeout on component unmount
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
    };
  }, [isProcessing]);

  
  
  // Check for processing error in resumeInfo
  useEffect(() => {
    if (resumeInfo && resumeInfo.processingError || processingError || processingTimeout) {
      setProcessingError(true);
      setLocalIsProcessing(false);
    } else {
      setProcessingError(false);
    }
  }, [resumeInfo]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  
  // File dropzone setup
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: loading || isProcessing,
  });
  
  // Update drag active state
  useEffect(() => {
    setDragActive(isDragActive);
  }, [isDragActive]);
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Upload file
      await uploadResume(selectedFile);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset after animation
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
      
      // Reset selected file
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      setUploadProgress(0);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteResume();
      setDeleteConfirm(false);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume. Please try again.');
    }
  };
  const handleProcessDelete = async () => {
    try {
      await deleteResume();
      setDeleteConfirm(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  // Handle download
  const handleDownload = async () => {
    try {
      await downloadResume();
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume. Please try again.');
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
        <p className="text-gray-600 mt-1">
          Upload your resume to enable AI-powered job application assistance
        </p>
      </div>
      
      {/* Resume Status Card */}
      {(hasResume || localIsProcessing) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                localIsProcessing 
                  ? 'bg-warning-100' 
                  : (resumeInfo?.processingFailed || processingError || processingTimeout)
                    ? 'bg-red-100' 
                    : 'bg-success-100'
              }`}>
                {localIsProcessing ? (
                  <ClockIcon className="w-6 h-6 text-warning-600" />
                ) : (processingTimeout || processingError || resumeInfo?.processingFailed) ? (
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6 text-success-600" />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {processingError ? 'Resume Processing Failed' : 
                   processingTimeout ? 'Processing Timeout' : 
                   localIsProcessing ? 'Processing Resume' : 'Resume Status'}
                </h3>
                <p className="text-gray-700">
                  {processingError ? 
                    `Unable to process your resume. Please try again or upload a different file.` :
                   processingTimeout ? 
                    'Resume processing took too long. Please try again or upload a different file.' :
                   localIsProcessing ?
                    'Your resume is being processed. This may take a few minutes.' :
                    'Your resume has been processed and is ready for AI assistance.'}
                </p>
                {resumeInfo && (
                  <p className="text-sm text-gray-600 mt-1">
                    Uploaded: {new Date(resumeInfo.uploadDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {!localIsProcessing && !resumeInfo?.processingFailed && !processingError && !processingTimeout && (
                <>
                  <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <PaperClipIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
              {(localIsProcessing && !processingTimeout) && (
                <div className="flex items-center text-warning-600 animate-pulse">
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
              {!localIsProcessing && (resumeInfo?.processingFailed || processingError || processingTimeout) && (
                <div className="flex space-x-2">
                    {handleProcessDelete}
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Upload Again
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {resumeInfo && !localIsProcessing && !resumeInfo.processingFailed && !processingError && !processingTimeout && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{resumeInfo.fileName}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(resumeInfo.fileSize)} • {resumeInfo.fileType.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Delete Confirmation */}
          {deleteConfirm && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-red-700 mb-4">
                Are you sure you want to delete your resume? This will disable AI-powered job application assistance.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Resume Upload Area */}
      {(!hasResume || selectedFile) && !localIsProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {hasResume ? 'Replace Your Resume' : 'Upload Your Resume'}
          </h2>
          
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : isDragReject
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-3">
              <div className="flex justify-center">
                <DocumentArrowUpIcon className={`h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
              </div>
              <div className="text-gray-700">
                <p className="font-medium">
                  {isDragActive ? 'Drop the file here' : 'Drag and drop your resume here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
              </div>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX, ODT, TXT (Max 5MB)
              </p>
            </div>
          </div>
          
          {/* File Rejection Errors */}
          {fileRejections.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 rounded-md text-red-700 text-sm">
              {fileRejections[0].errors.map((error) => (
                <p key={error.code}>{error.message}</p>
              ))}
            </div>
          )}
          
          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mt-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-md">
                <DocumentIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={loading || uploadProgress > 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Resume'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-full">
              <SparklesIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">AI-Powered Assistance</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our AI technology will analyze your resume and automatically suggest relevant information for job applications.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Analyzes your resume to extract key information</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Automatically fills job application forms</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Provides insights to optimize your resume</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-warning-100 rounded-full">
              <ExclamationCircleIcon className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Best Practices</h3>
          </div>
          <p className="text-gray-600 mb-4">
            For the best results with our AI assistant, follow these resume guidelines:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Use a clean, standard format without complex tables or graphics</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Include detailed work experience with dates and responsibilities</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Clearly list your skills, education, and contact information</span>
            </li>
          </ul>
        </motion.div>
      </div>
      
      {/* Resume Insights Card */}
      {hasResume && !localIsProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-full">
              <SparklesIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Resume Insights</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our AI has analyzed your resume and can provide insights to help you optimize it for job applications.
          </p>
          <Link
            to="/dashboard/resume/insights"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            View Resume Insights
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;