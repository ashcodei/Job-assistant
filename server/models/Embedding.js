/**
 * Vector Embedding Model
 * For storing resume embeddings for RAG-based retrieval
 */

const mongoose = require('mongoose');

const EmbeddingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  segmentType: {
    type: String,
    enum: [
      'education',
      'experience',
      'skill',
      'project',
      'certification',
      'language',
      'summary',
      'contact',
      'personal'
    ],
    required: true
  },
  segmentId: {
    type: String,
    default: null
  },
  text: {
    type: String,
    required: true
  },
  vector: {
    type: [Number],
    required: true
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

// Create indexes for vector search
EmbeddingSchema.index({ user: 1 });
EmbeddingSchema.index({ resume: 1 });
EmbeddingSchema.index({ segmentType: 1 });

module.exports = mongoose.model('Embedding', EmbeddingSchema);