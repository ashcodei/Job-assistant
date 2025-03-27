/**
 * Form Validation Utilities
 * Common validation functions and Yup schemas
 */

import * as Yup from 'yup';

/**
 * Common validation schemas for reuse across forms
 */
export const schemas = {
  /**
   * Name validation schema
   */
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  
  /**
   * Email validation schema
   */
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long'),
  
  /**
   * Password validation schema
   */
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  /**
   * Confirm password validation schema
   */
  confirmPassword: (fieldName = 'password') => 
    Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref(fieldName)], 'Passwords must match'),
  
  /**
   * Phone number validation schema (optional field)
   */
  phone: Yup.string()
    .nullable()
    .matches(
      /^(\+\d{1,3}[- ]?)?\d{10,14}$/,
      'Invalid phone number format'
    ),
  
  /**
   * URL validation schema (optional field)
   */
  url: Yup.string()
    .nullable()
    .url('Please enter a valid URL'),
  
  /**
   * Date validation schema (optional field)
   */
  date: Yup.date()
    .nullable()
    .typeError('Please enter a valid date'),
  
  /**
   * Future date validation schema (optional field)
   */
  futureDate: Yup.date()
    .nullable()
    .typeError('Please enter a valid date')
    .min(new Date(), 'Date must be in the future'),
};

/**
 * Validation utility functions
 */

/**
 * Check if a string is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // RFC 5322 compliant regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Check if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if a string is a strong password
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength score and feedback
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      feedback: 'Password is required',
      isStrong: false,
    };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    score += 1;
  }
  
  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add an uppercase letter');
  } else {
    score += 1;
  }
  
  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add a lowercase letter');
  } else {
    score += 1;
  }
  
  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Add a number');
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Add a special character');
  } else {
    score += 1;
  }
  
  return {
    score, // 0-5 score
    feedback: feedback.join('. ') || 'Strong password',
    isStrong: score >= 4,
  };
};

/**
 * Check if a string is a valid phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Basic international phone number regex
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;
  return phoneRegex.test(phone.replace(/[\s()\-]/g, ''));
};

/**
 * Format a phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format according to length
  if (cleaned.length === 10) {
    // US format: (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length > 10) {
    // International format: +X XXX XXX XXXX
    return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Return original if we can't format
  return phone;
};

/**
 * Normalize a phone number to E.164 format
 * @param {string} phone - Phone number to normalize
 * @param {string} defaultCountryCode - Default country code to use if not specified
 * @returns {string} Normalized phone number
 */
export const normalizePhoneNumber = (phone, defaultCountryCode = '1') => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if country code is included
  if (cleaned.length === 10) {
    // Add default country code
    return `+${defaultCountryCode}${cleaned}`;
  } else if (cleaned.length > 10) {
    // Country code is likely included
    return `+${cleaned}`;
  }
  
  // Return original if we can't normalize
  return phone;
};

// Default export for all validation utilities
export default {
  schemas,
  isValidEmail,
  isValidUrl,
  checkPasswordStrength,
  isValidPhone,
  formatPhoneNumber,
  normalizePhoneNumber,
};