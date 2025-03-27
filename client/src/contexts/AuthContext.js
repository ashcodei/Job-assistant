import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || null);
  
  const navigate = useNavigate();
  
  // Configure axios - explicitly set API URL to port 3000
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Add auth token to requests
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);
  
  // Check if token is valid on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Check if token is expired
        const decodedToken = jwtDecode(authToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token is expired
          logout();
          return;
        }
        
        // Verify token with the server
        const response = await axios.get('/api/auth/validate');
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [authToken]);
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Save token and user data
      localStorage.setItem('auth_token', response.data.token);
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
        
        // Check if email needs verification
        if (error.response.data.needsVerification) {
          toast.error('Please verify your email before logging in');
          navigate('/verify-email', { state: { email } });
          return;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });
      
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/verify-email', { state: { email } });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    navigate('/login');
  };
  
  // Google authentication
  const googleAuth = async (googleToken, userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/google', {
        googleToken,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      });
      
      // Save token and user data
      localStorage.setItem('auth_token', response.data.token);
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Google auth error:', error);
      let errorMessage = 'Google authentication failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/verify-email', { token });
      
      // Save token and user data
      localStorage.setItem('auth_token', response.data.token);
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      
      toast.success('Email verified successfully!');
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      let errorMessage = 'Email verification failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Resend verification email
  const resendVerification = async (email) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/resend-verification', { email });
      
      toast.success('Verification email sent! Please check your inbox.');
      return true;
    } catch (error) {
      console.error('Resend verification error:', error);
      let errorMessage = 'Failed to resend verification email. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/forgot-password', { email });
      
      toast.success('Password reset email sent! Please check your inbox.');
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      });
      
      // Save token and user data
      localStorage.setItem('auth_token', response.data.token);
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      
      toast.success('Password reset successful!');
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put('/api/user/profile', userData);
      
      setCurrentUser(response.data.user);
      toast.success('Profile updated successfully!');
      return response.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.post('/api/user/change-password', {
        currentPassword,
        newPassword
      });
      
      toast.success('Password changed successfully!');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete account
  const deleteAccount = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/user/account');
      
      localStorage.removeItem('auth_token');
      setAuthToken(null);
      setCurrentUser(null);
      
      toast.success('Account deleted successfully.');
      navigate('/');
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      let errorMessage = 'Failed to delete account. Please try again.';
      
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
    currentUser,
    loading,
    login,
    register,
    logout,
    googleAuth,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    deleteAccount,
    isAuthenticated: !!authToken
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};