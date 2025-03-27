/**
 * API Service Utility
 * Handles HTTP requests with proper error handling and authentication
 */

import axios from 'axios';
import { toast } from 'react-hot-toast';

// Base axios instance configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // The request was made, but the server responded with an error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (localStorage.getItem('auth_token')) {
            // Only show toast if we had a token (user was logged in)
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('auth_token');
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;
        
        case 403:
          // Forbidden - user doesn't have permission
          toast.error(data.error || 'You do not have permission to access this resource.');
          break;
        
        case 404:
          // Not found
          console.error('Resource not found:', error.config.url);
          break;
        
        case 422:
          // Validation error
          const validationErrors = data.errors || {};
          const firstError = Object.values(validationErrors)[0];
          if (firstError) {
            toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
          } else {
            toast.error(data.error || 'Validation failed. Please check your input.');
          }
          break;
        
        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;
        
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error('Server error. Please try again later.');
          break;
        
        default:
          // Other error statuses
          if (data && data.error) {
            toast.error(data.error);
          }
          break;
      }
    } else if (error.request) {
      // The request was made, but no response was received
      toast.error('Network error. Please check your connection and try again.');
      console.error('Network Error:', error.request);
    } else {
      // Error setting up the request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  /**
   * Perform a GET request
   * @param {string} url - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional axios options
   * @returns {Promise<any>} - Response data
   */
  get: async (url, params = {}, options = {}) => {
    try {
      const response = await api.get(url, { params, ...options });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional axios options
   * @returns {Promise<any>} - Response data
   */
  post: async (url, data = {}, options = {}) => {
    try {
      const response = await api.post(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional axios options
   * @returns {Promise<any>} - Response data
   */
  put: async (url, data = {}, options = {}) => {
    try {
      const response = await api.put(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional axios options
   * @returns {Promise<any>} - Response data
   */
  patch: async (url, data = {}, options = {}) => {
    try {
      const response = await api.patch(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Additional axios options
   * @returns {Promise<any>} - Response data
   */
  delete: async (url, options = {}) => {
    try {
      const response = await api.delete(url, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Upload file with multipart/form-data
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with files
   * @param {Function} onProgress - Progress callback (percentage)
   * @returns {Promise<any>} - Response data
   */
  uploadFile: async (url, formData, onProgress = null) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Download a file
   * @param {string} url - API endpoint
   * @param {Object} params - Query parameters
   * @param {string} filename - Name to save the file as
   * @returns {Promise<void>}
   */
  downloadFile: async (url, params = {}, filename = '') => {
    try {
      const response = await api.get(url, {
        params,
        responseType: 'blob',
      });
      
      // Create blob link to download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Use filename from Content-Disposition header if available and no filename was provided
      if (!filename && response.headers['content-disposition']) {
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition.match(/filename="?([^"]*)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;