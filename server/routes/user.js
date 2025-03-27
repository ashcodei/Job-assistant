/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// Get current user profile
router.get('/profile', userController.getCurrentUser);

// Update user profile
router.put('/profile', userController.updateProfile);

// Change password
router.post('/change-password', userController.changePassword);

// Get user resume status
router.get('/resume-status', userController.getResumeStatus);

// Delete user account
router.delete('/account', userController.deleteAccount);

// Get user stats
router.get('/stats', userController.getUserStats);

module.exports = router;