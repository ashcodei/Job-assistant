/**
 * Job Application Model
 */

const mongoose = require('mongoose');

// Application Form Field Schema
const FormFieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: null
  },
  value: {
    type: String,
    default: null
  },
  aiSuggestion: {
    type: String,
    default: null
  },
  confidenceLevel: {
    type: String,
    enum: ['red', 'yellow', 'green'],
    default: 'red'
  },
  userFeedback: {
    type: Boolean,
    default: null
  },
  userCorrection: {
    type: String,
    default: null
  }
});

// Job Application Schema
const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: null
  },
  jobLocation: {
    type: String,
    default: null
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'other', null],
    default: null
  },
  applicationUrl: {
    type: String,
    default: null
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn', 'saved'],
    default: 'applied'
  },
  source: {
    type: String,
    enum: ['linkedin', 'indeed', 'glassdoor', 'company-website', 'referral', 'other', null],
    default: null
  },
  salary: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  formFields: [FormFieldSchema],
  timeline: [{
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: null
    }
  }],
  interviews: [{
    interviewType: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'other']
    },
    interviewDate: {
      type: Date,
      required: true
    },
    interviewerName: {
      type: String,
      default: null
    },
    interviewerTitle: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: null
    },
    outcome: {
      type: String,
      enum: ['pending', 'passed', 'failed', null],
      default: 'pending'
    }
  }],
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['resume', 'cover-letter', 'portfolio', 'other'],
      default: 'other'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
ApplicationSchema.index({ user: 1, company: 1, jobTitle: 1 });
ApplicationSchema.index({ applicationDate: -1 });
ApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);