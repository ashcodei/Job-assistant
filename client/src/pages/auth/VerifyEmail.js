import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SparklesIcon, EnvelopeIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // Extract token and email from URL and location state
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
    
    // Get email from location state (from register page)
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);
  
  // Automatically verify if token is present
  useEffect(() => {
    const verifyWithToken = async () => {
      if (token) {
        setVerifying(true);
        try {
          await verifyEmail(token);
          setVerificationSuccess(true);
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationError(
            error.response?.data?.error || 'Email verification failed. The link may have expired.'
          );
        } finally {
          setVerifying(false);
        }
      }
    };
    
    verifyWithToken();
  }, [token, verifyEmail, navigate]);
  
  // Handle countdown for resend timeout
  useEffect(() => {
    let timer = null;
    if (resendTimeout && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendTimeout(false);
      setCountdown(60);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [resendTimeout, countdown]);
  
  // Handle email verification resend
  const handleResendVerification = async () => {
    if (!email || resendLoading || resendTimeout) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      await resendVerification(email);
      setResendSuccess(true);
      setResendTimeout(true);
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setResendLoading(false);
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
          {verificationSuccess ? 'Email Verified!' : 'Verify your email'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {verificationSuccess
            ? 'Your email has been successfully verified'
            : 'Please check your inbox and click the verification link'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Verification success state */}
          {verificationSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Verification successful</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your email has been verified. Redirecting you to the dashboard...
              </p>
            </motion.div>
          )}
          
          {/* Verification form/action */}
          {!verificationSuccess && !verifying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Verification error */}
              {verificationError && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Verification Failed
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{verificationError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-md bg-blue-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Verification Email Sent
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We've sent a verification email to <strong>{email || 'your email address'}</strong>.
                        Please check your inbox and click the verification link to activate your account.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <Link
                          to="/login"
                          className="bg-blue-100 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Login Instead
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resend section */}
              <div className="mt-6">
                <p className="text-sm text-gray-700 mb-3">
                  Didn't receive the email? Check your spam folder or request a new verification link.
                </p>
                
                {resendSuccess && (
                  <div className="rounded-md bg-green-50 p-3 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Verification email sent again!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={!email || resendLoading || resendTimeout}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? (
                      <ArrowPathIcon className="animate-spin h-4 w-4" />
                    ) : resendTimeout ? (
                      `Resend in ${countdown}s`
                    ) : (
                      'Resend Email'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Verification in progress */}
          {verifying && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">Verifying your email</h3>
              <p className="text-gray-500 mt-2">Please wait while we verify your email address...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;