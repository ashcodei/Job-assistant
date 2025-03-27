/**
 * AI Feedback Model
 * Stores user feedback for improving AI suggestions
 */

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null
  },
  url: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    default: 'text'
  },
  originalSuggestion: {
    type: String,
    default: null
  },
  userCorrection: {
    type: String,
    required: true
  },
  isIncorporated: {
    type: Boolean,
    default: false
  },
  confidenceLevel: {
    type: String,
    enum: ['red', 'yellow', 'green'],
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
FeedbackSchema.index({ user: 1 });
FeedbackSchema.index({ fieldName: 1 });
FeedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);