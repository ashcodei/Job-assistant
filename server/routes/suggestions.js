/**
 * Suggestions Routes
 */

const express = require('express');
const router = express.Router();
const suggestionsController = require('../controllers/suggestionsController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// Generate suggestions for form fields
router.post('/', suggestionsController.generateSuggestions);

// Get single field suggestion
router.post('/field', suggestionsController.getSingleSuggestion);

// Get resume insights
router.get('/resume-insights', suggestionsController.getResumeInsights);

module.exports = router;