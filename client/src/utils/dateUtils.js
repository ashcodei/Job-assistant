/**
 * Date Formatting Utilities
 * Consistent date handling throughout the application
 */

import { format, formatDistance, parseISO, isValid, differenceInDays } from 'date-fns';

/**
 * Format a date string or Date object into a human-readable format
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format pattern (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  // Parse ISO string if needed
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Return empty string if date is invalid
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, formatString);
};

/**
 * Format a date with time
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format pattern (default: 'MMM dd, yyyy h:mm a')
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, formatString = 'MMM dd, yyyy h:mm a') => {
  return formatDate(date, formatString);
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - Date to compare
 * @param {Date} baseDate - Date to compare against (default: current date)
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, baseDate = new Date()) => {
  if (!date) return '';
  
  // Parse ISO string if needed
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Return empty string if date is invalid
  if (!isValid(dateObj)) return '';
  
  return formatDistance(dateObj, baseDate, { addSuffix: true });
};

/**
 * Format a date for display in a calendar
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "Jan 1")
 */
export const formatCalendarDate = (date) => {
  return formatDate(date, 'MMM d');
};

/**
 * Format a date for display in a form input
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (yyyy-MM-dd)
 */
export const formatInputDate = (date) => {
  return formatDate(date, 'yyyy-MM-dd');
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  // Parse ISO string if needed
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Return false if date is invalid
  if (!isValid(dateObj)) return false;
  
  return dateObj < new Date();
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  // Parse ISO string if needed
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Return false if date is invalid
  if (!isValid(dateObj)) return false;
  
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Calculate days until a date
 * @param {string|Date} date - Target date
 * @returns {number} Number of days until the date (negative if in the past)
 */
export const daysUntil = (date) => {
  if (!date) return 0;
  
  // Parse ISO string if needed
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Return 0 if date is invalid
  if (!isValid(dateObj)) return 0;
  
  return differenceInDays(dateObj, new Date());
};

/**
 * Generate an array of date objects for a date range
 * @param {string|Date} startDate - Range start date
 * @param {string|Date} endDate - Range end date
 * @returns {Date[]} Array of date objects
 */
export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  
  // Parse ISO strings if needed
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  // Return empty array if dates are invalid
  if (!isValid(start) || !isValid(end)) return [];
  
  const dateRange = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dateRange;
};

/**
 * Format a time duration in minutes to hours and minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

/**
 * Get month name from month number (0-11)
 * @param {number} monthNumber - Month number (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[monthNumber] || '';
};

export default {
  formatDate,
  formatDateTime,
  getRelativeTime,
  formatCalendarDate,
  formatInputDate,
  isPastDate,
  isToday,
  daysUntil,
  getDateRange,
  formatDuration,
  getMonthName
};