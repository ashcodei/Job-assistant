/**
 * Feedback Routes
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// Submit feedback for an AI suggestion
router.post('/', feedbackController.submitFeedback);

// Get feedback history
router.get('/history', feedbackController.getFeedbackHistory);

module.exports = router;