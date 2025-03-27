import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserCircleIcon,
  PhoneIcon,
  LinkIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  KeyIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { currentUser, updateProfile, changePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  
  // Profile validation schema
  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    dateOfBirth: Yup.date().nullable(),
    gender: Yup.string().nullable(),
    phone: Yup.string().nullable(),
    linkedIn: Yup.string().nullable().url('Must be a valid URL'),
  });
  
  // Password validation schema
  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });
  
  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      setSubmitLoading(true);
      await updateProfile(values);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSubmitLoading(false);
      setSubmitting(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    
    try {
      // Validate with Yup
      await PasswordSchema.validate(passwordFields);
      
      setSubmitLoading(true);
      await changePassword(passwordFields.currentPassword, passwordFields.newPassword);
      
      // Reset form on success
      setPasswordFields({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.name === 'ValidationError') {
        setPasswordError(error.message);
      } else if (error.response && error.response.data) {
        setPasswordError(error.response.data.error || 'Failed to change password');
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
      
      toast.error(passwordError || 'Failed to change password');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Handle password field change
  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setSubmitLoading(true);
      await deleteAccount();
      toast.success('Account deleted successfully');
      // Note: Redirect is handled by the auth context
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
      setDeleteConfirm(false);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Initial profile values
  const initialValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    dateOfBirth: currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth) : null,
    gender: currentUser?.gender || '',
    phone: currentUser?.phone || '',
    linkedIn: currentUser?.linkedIn || '',
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserCircleIcon className="w-5 h-5 inline mr-2 -mt-0.5" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <KeyIcon className="w-5 h-5 inline mr-2 -mt-0.5" />
              Password
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrashIcon className="w-5 h-5 inline mr-2 -mt-0.5" />
              Delete Account
            </button>
          </nav>
        </div>
      </div>
      
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleProfileUpdate}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.name && touched.name
                          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      } rounded-md`}
                      placeholder="Your full name"
                    />
                    {errors.name && touched.name && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="name">
                    {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                  </ErrorMessage>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      disabled={currentUser?.authType === 'google'}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email && touched.email
                          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      } rounded-md ${currentUser?.authType === 'google' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && touched.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {currentUser?.authType === 'google' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                  <ErrorMessage name="email">
                    {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                  </ErrorMessage>
                </div>
                
                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={values.dateOfBirth}
                      onChange={(date) => setFieldValue('dateOfBirth', date)}
                      dateFormat="MMMM d, yyyy"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholderText="Select your birth date"
                      showYearDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender (Optional)
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      name="gender"
                      id="gender"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="tel"
                      name="phone"
                      id="phone"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <ErrorMessage name="phone">
                    {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                  </ErrorMessage>
                </div>
                
                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="url"
                      name="linkedIn"
                      id="linkedIn"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.linkedIn && touched.linkedIn
                          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      } rounded-md`}
                      placeholder="https://linkedin.com/in/username"
                    />
                    {errors.linkedIn && touched.linkedIn && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="linkedIn">
                    {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                  </ErrorMessage>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || submitLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(isSubmitting || submitLoading) ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      )}
      
      {/* Password Tab */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          {currentUser?.authType === 'google' ? (
            <div className="text-center py-6">
              <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password Not Required</h3>
              <p className="text-gray-500">
                You're signed in with Google, so you don't need a password to access your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordFields.currentPassword}
                    onChange={handlePasswordFieldChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordFields.newPassword}
                    onChange={handlePasswordFieldChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordFields.confirmPassword}
                    onChange={handlePasswordFieldChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}
      
      {/* Delete Account Tab */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Delete Your Account</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
            </p>
            
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                Delete Account
              </button>
            ) : (
              <div className="mt-6 border border-red-300 rounded-md p-4 bg-red-50">
                <h4 className="text-sm font-medium text-red-800">Are you absolutely sure?</h4>
                <p className="mt-1 text-sm text-red-700">
                  This will permanently delete your account and all associated data. You won't be able to recover it.
                </p>
                <div className="mt-4 flex space-x-4 justify-center">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={submitLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete My Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Account Info Card */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <div className="mt-1 text-sm text-gray-500">
              <p>You are signed in with {currentUser?.authType === 'google' ? 'Google' : 'Email'}</p>
              <p>Account created: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
          {currentUser?.isVerified && (
            <div className="ml-auto flex items-center text-green-700">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;