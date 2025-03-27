/**
 * Resume Routes
 */

const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// Upload resume
router.post('/upload', resumeController.uploadResume);

// Get resume status
router.get('/status', resumeController.getResumeStatus);

// Get parsed resume data
router.get('/data', resumeController.getResumeData);

// Delete resume
router.delete('/', resumeController.deleteResume);

// Download resume file
router.get('/download', resumeController.downloadResume);

module.exports = router;