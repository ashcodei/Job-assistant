import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SparklesIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleAuth } = useAuth();
  const navigate = useNavigate();
  
  // Validation schema
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name is too short'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    agreeTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  });
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle Google OAuth using Google Identity Services (GIS)
  const handleGoogleAuth = async () => {
    if (!window.google) {
      console.error('Google API not loaded');
      return;
    }
    
    try {
      setGoogleLoading(true);
      
      // Initialize Google Sign In
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false, // Disable auto-select to show the popup
        cancel_on_tap_outside: true
      });
      
      // Render the Google Sign-In button programmatically
      const googleButton = document.getElementById('google-signin-button');
      if (googleButton) {
        // Clear existing content
        googleButton.innerHTML = '';
        
        // Render the button
        window.google.accounts.id.renderButton(googleButton, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 270
        });
        
        // Click the button automatically
        const buttonElement = googleButton.querySelector('div[role="button"]');
        if (buttonElement) {
          buttonElement.click();
        }
      } else {
        // If button element isn't available, use prompt()
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google sign-in prompt not displayed or skipped');
            setGoogleLoading(false);
          }
        });
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      setGoogleLoading(false);
    }
  };
  
  // Handle Google callback
  const handleGoogleCallback = async (response) => {
    try {
      if (response.credential) {
        // Get user info from ID token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        await googleAuth(response.credential, {
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google callback error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };
  
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-md">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Social Register Buttons */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-b-2 border-gray-900 rounded-full animate-spin mr-3"></div>
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.0001 4.52905C14.0372 4.52905 15.7839 5.4085 17.0001 6.73905L20.4858 3.27905C18.4229 1.2535 15.4544 0 12.0001 0C7.3929 0 3.3943 2.66 1.3858 6.56905L5.34293 9.66958C6.3429 6.73905 8.9429 4.52905 12.0001 4.52905Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275C23.49 11.495 23.42 10.715 23.3 9.995H12V14.545H18.47C18.18 16.03 17.34 17.245 16.07 18.085L19.93 21.09C22.19 19 23.49 15.925 23.49 12.275Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.34293 14.3305C5.08293 13.6305 4.92578 12.8691 4.92578 12.0005C4.92578 11.132 5.08293 10.3705 5.33007 9.67048L1.37293 6.57048C0.498636 8.21191 0 10.0605 0 12.0005C0 13.9405 0.498636 15.7891 1.3858 17.4305L5.34293 14.3305Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12.0001 24C15.4544 24 18.3601 22.92 20.4973 21.09L16.6373 18.085C15.5516 18.8449 13.9258 19.285 12.0001 19.285C8.9429 19.285 6.3429 17.075 5.34293 14.145L1.3858 17.245C3.3943 21.15 7.3929 24 12.0001 24Z"
                  />
                </svg>
              )}
              Sign up with Google
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>

            {/* Register Form */}
            <div className="mt-6">
              <Formik
                initialValues={{ 
                  name: '', 
                  email: '', 
                  password: '', 
                  confirmPassword: '',
                  agreeTerms: false
                }}
                validationSchema={RegisterSchema}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  try {
                    await register(values.name, values.email, values.password);
                    navigate('/verify-email', { state: { email: values.email } });
                  } catch (error) {
                    setStatus({
                      error: error.response?.data?.error || 'Registration failed. Please try again.'
                    });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, status }) => (
                  <Form className="space-y-6">
                    {status && status.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
                      >
                        {status.error}
                      </motion.div>
                    )}
                    
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="name">
                          {msg => (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                      <ErrorMessage name="name">
                        {msg => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="you@example.com"
                        />
                        <ErrorMessage name="email">
                          {msg => (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                      <ErrorMessage name="email">
                        {msg => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          autoComplete="new-password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <ErrorMessage name="password">
                          {msg => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                        </ErrorMessage>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          id="confirmPassword"
                          autoComplete="new-password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="••••••••"
                        />
                        <ErrorMessage name="confirmPassword">
                          {msg => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                        </ErrorMessage>
                      </div>
                    </div>
                    
                    {/* Terms Agreement */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Field
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                            Privacy Policy
                          </Link>
                        </label>
                        <ErrorMessage name="agreeTerms">
                          {msg => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;