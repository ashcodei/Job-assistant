/**
 * Suggestions Controller
 * Handles AI-powered form field suggestions
 */

const User = require('../models/User');
const Application = require('../models/Application');
const aiService = require('../services/aiService');

/**
 * Generate suggestions for form fields
 */
exports.generateSuggestions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const formData = req.body;
    
    // Validate request
    if (!formData || !formData.fields || !Array.isArray(formData.fields)) {
      return res.status(400).json({
        error: 'Invalid form data. Fields array is required.'
      });
    }
    
    // Check if user has a resume
    const user = await User.findById(userId).select('hasResume');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    if (!user.hasResume) {
      return res.status(400).json({
        error: 'Resume required for generating suggestions',
        needsResume: true
      });
    }
    
    // Process form data with AI service
    const suggestions = await aiService.processFormSuggestions(userId, formData);
    
    // Create or update an application entry
    let application = await Application.findOne({
      user: userId,
      applicationUrl: formData.url
    });
    
    if (!application) {
      // Create new application entry
      application = new Application({
        user: userId,
        company: extractCompanyName(formData.url, formData.title),
        jobTitle: extractJobTitle(formData.title),
        applicationUrl: formData.url,
        status: 'saved',
        formFields: formData.fields.map((field, index) => {
          const suggestion = suggestions.fields.find(s => s.fieldId === field.fieldId);
          
          return {
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            label: field.label,
            aiSuggestion: suggestion ? suggestion.value : '',
            confidenceLevel: suggestion ? suggestion.confidence : 'red'
          };
        })
      });
      
      await application.save();
    } else {
      // Update existing application
      const formFields = formData.fields.map((field, index) => {
        const suggestion = suggestions.fields.find(s => s.fieldId === field.fieldId);
        
        return {
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          label: field.label,
          aiSuggestion: suggestion ? suggestion.value : '',
          confidenceLevel: suggestion ? suggestion.confidence : 'red'
        };
      });
      
      application.formFields = formFields;
      await application.save();
    }
    
    // Return suggestions to client
    res.status(200).json(suggestions);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Extract company name from URL or title
 * @param {string} url - Application URL
 * @param {string} title - Page title
 * @returns {string} - Extracted company name
 */
const extractCompanyName = (url, title) => {
  // Try to extract from URL
  let domain = '';
  try {
    domain = new URL(url).hostname;
    domain = domain.replace('www.', '');
    
    // Extract domain parts
    const domainParts = domain.split('.');
    if (domainParts.length > 1) {
      domain = domainParts[0];
    }
  } catch (error) {
    // Invalid URL, try title instead
  }
  
  // If domain extraction failed or is too generic, try from title
  if (!domain || domain.length < 3 || ['com', 'org', 'net', 'gov', 'edu', 'io'].includes(domain)) {
    if (title) {
      // Look for common patterns in job posting titles
      const patterns = [
        /at\s+([\w\s]+)(?:\s+\||\s+-|$)/i,
        /([\w\s]+)\s+careers/i,
        /([\w\s]+)\s+jobs/i,
        /([\w\s]+)\s+hiring/i
      ];
      
      for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      
      // If no patterns match, use the first part of the title
      const titleParts = title.split(/[\|\-]/);
      if (titleParts.length > 1) {
        return titleParts[titleParts.length - 1].trim();
      }
    }
  }
  
  // Capitalize first letter of domain
  return domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Unknown Company';
};

/**
 * Extract job title from page title
 * @param {string} title - Page title
 * @returns {string} - Extracted job title
 */
const extractJobTitle = (title) => {
  if (!title) return 'Unknown Position';
  
  // Look for common patterns in job posting titles
  const patterns = [
    /^([\w\s]+)(?:\s+at|\s+\||\s+-)/i,
    /hiring[\s:]+(.+?)(?:\s+at|\s+\||\s+-|$)/i,
    /job[\s:]+(.+?)(?:\s+at|\s+\||\s+-|$)/i,
    /position[\s:]+(.+?)(?:\s+at|\s+\||\s+-|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no patterns match, use the first part of the title
  const titleParts = title.split(/[\|\-]/);
  if (titleParts.length > 0) {
    return titleParts[0].trim();
  }
  
  return 'Unknown Position';
};

/**
 * Get single field suggestion
 */
exports.getSingleSuggestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fieldData } = req.body;
    
    // Validate request
    if (!fieldData || !fieldData.fieldName) {
      return res.status(400).json({
        error: 'Invalid field data. Field name is required.'
      });
    }
    
    // Check if user has a resume
    const user = await User.findById(userId).select('hasResume');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    if (!user.hasResume) {
      return res.status(400).json({
        error: 'Resume required for generating suggestions',
        needsResume: true
      });
    }
    
    // Get suggestion for single field
    const suggestion = await aiService.getSuggestionForField(userId, fieldData);
    
    res.status(200).json({
      suggestion: suggestion.suggestion,
      confidence: suggestion.confidence
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get resume insights
 */
exports.getResumeInsights = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check if user has a resume
    const user = await User.findById(userId).select('hasResume');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    if (!user.hasResume) {
      return res.status(400).json({
        error: 'Resume required for generating insights',
        needsResume: true
      });
    }
    
    // Generate resume insights
    try{
        const insights = await aiService.generateResumeInsights(userId);
        res.status(200).json({ insights });
    }
    catch(error) {
        next(error);
    }
    
  } catch (error) {
    next(error);
  }
};