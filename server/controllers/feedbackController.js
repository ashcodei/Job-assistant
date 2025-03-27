/**
 * Feedback Controller
 * Handles user feedback for AI suggestions
 */

const Feedback = require('../models/Feedback');
const Application = require('../models/Application');
const aiService = require('../services/aiService');

/**
 * Submit feedback for an AI suggestion
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { url, fieldId, fieldName, originalSuggestion, userCorrection } = req.body;
    
    // Validate required fields
    if (!url || !fieldName || !userCorrection) {
      return res.status(400).json({
        error: 'Missing required fields: url, fieldName, and userCorrection are required'
      });
    }
    
    // Find application if it exists
    let applicationId = null;
    const application = await Application.findOne({
      user: userId,
      applicationUrl: url
    });
    
    if (application) {
      applicationId = application._id;
      
      // Update application form field with user correction
      const fieldIndex = application.formFields.findIndex(
        field => field.fieldName === fieldName || field._id.toString() === fieldId
      );
      
      if (fieldIndex !== -1) {
        application.formFields[fieldIndex].userCorrection = userCorrection;
        application.formFields[fieldIndex].userFeedback = true;
        
        await application.save();
      }
    }
    
    // Create feedback entry
    const feedback = new Feedback({
      user: userId,
      application: applicationId,
      url,
      fieldName,
      originalSuggestion,
      userCorrection,
      confidenceLevel: req.body.confidenceLevel,
      metadata: {
        browser: req.headers['user-agent'],
        timestamp: Date.now()
      }
    });
    
    await feedback.save();
    
    // Process feedback with AI service (asynchronously)
    processFeedbackAsync(userId, {
      url,
      fieldName,
      originalSuggestion,
      userCorrection
    });
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Process feedback asynchronously
 * @param {string} userId - User ID
 * @param {object} feedbackData - Feedback data
 */
const processFeedbackAsync = async (userId, feedbackData) => {
  try {
    await aiService.processFeedback(userId, feedbackData);
    
    // Update feedback entry as incorporated
    await Feedback.updateOne(
      { 
        user: userId,
        fieldName: feedbackData.fieldName,
        userCorrection: feedbackData.userCorrection
      },
      { isIncorporated: true }
    );
    
    console.log(`Feedback for ${feedbackData.fieldName} processed successfully`);
  } catch (error) {
    console.error('Error processing feedback:', error);
  }
};

/**
 * Get feedback history
 */
exports.getFeedbackHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count
    const totalCount = await Feedback.countDocuments({ user: userId });
    
    // Get feedback entries
    const feedback = await Feedback.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('fieldName originalSuggestion userCorrection confidenceLevel createdAt');
    
    res.status(200).json({
      feedback,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
};