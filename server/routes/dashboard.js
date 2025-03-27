/**
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// Get dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get application history
router.get('/applications', dashboardController.getApplicationHistory);

// Get application detail
router.get('/applications/:id', dashboardController.getApplicationDetail);

// Update application status
router.put('/applications/:id/status', dashboardController.updateApplicationStatus);

// Add interview to application
router.post('/applications/:id/interviews', dashboardController.addInterview);

// Update interview outcome
router.put('/applications/:id/interviews/:interviewId', dashboardController.updateInterviewOutcome);

// Delete application
router.delete('/applications/:id', dashboardController.deleteApplication);

// Get calendar data
router.get('/calendar', dashboardController.getCalendarData);

module.exports = router;