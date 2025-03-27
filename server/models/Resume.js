/**
 * Resume Model
 */

const mongoose = require('mongoose');

// Education Schema
const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldOfStudy: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  gpa: {
    type: String,
    default: null
  },
  achievements: [{
    type: String
  }],
  description: {
    type: String,
    default: null
  }
});

// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  isCurrentJob: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  achievements: [{
    type: String
  }],
  skills: [{
    type: String
  }]
});

// Skill Schema
const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', null],
    default: null
  },
  yearsOfExperience: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    default: null
  }
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: null
  },
  technologies: [{
    type: String
  }],
  achievements: [{
    type: String
  }]
});

// Certification Schema
const CertificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  issuingOrganization: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: null
  },
  expirationDate: {
    type: Date,
    default: null
  },
  credentialId: {
    type: String,
    default: null
  },
  credentialUrl: {
    type: String,
    default: null
  }
});

// Language Schema
const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  proficiency: {
    type: String,
    enum: ['elementary', 'limited_working', 'professional_working', 'full_professional', 'native', null],
    default: null
  }
});

// Resume Schema
const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingError: {
    type: String,
    default: null
  },
  // Structured resume data
  personalInfo: {
    fullName: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    zipCode: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    },
    website: {
      type: String,
      default: null
    },
    summary: {
      type: String,
      default: null
    }
  },
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [SkillSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  languages: [LanguageSchema],
  // Vector embeddings for RAG
  embeddings: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  rawText: {
    type: String,
    default: null
  },
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

module.exports = mongoose.model('Resume', ResumeSchema);