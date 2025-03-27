/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login with email and password
router.post('/login', authController.login);

// Google OAuth authentication
router.post('/google', authController.googleAuth);

// Verify email
router.post('/verify-email', authController.verifyEmail);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Validate token
router.get('/validate', protect, authController.validateToken);

// Logout
router.post('/logout', protect, authController.logout);

// Resend verification email
router.post('/resend-verification', authController.resendVerification);

module.exports = router;