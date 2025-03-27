/**
 * AI Service
 * Handles integrations with Ollama for RAG and form suggestions
 */

const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');
const Embedding = require('../models/Embedding');
const User = require('../models/User');
const Resume = require('../models/Resume');
const {Ollama} = require('ollama');

const ollama = new Ollama({
    url: 'http://localhost:11434'
});

// Ollama API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2:latest';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';
const claude = new Anthropic({
    apiKey: CLAUDE_API_KEY,
  });
/**
 * Generate text with Ollama
 * @param {string} prompt - The prompt to send to Ollama
 * @param {object} options - Additional options for Ollama
 * @returns {Promise<string>} - Generated text
 */
const generateText = async (prompt, options = {}) => {
  try {

    // const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
    //   model: OLLAMA_MODEL,
    //   prompt,
    //   stream: false,
    //   ...options
    // });

    // const response = await ollama.generate({
    //     model: OLLAMA_MODEL,
    //     prompt: prompt,
    //     stream: false,
    //     ...options
    // });
    
    // console.log(response.output);
    
    // return response.data.response;
    const response = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        messages: [
          { role: 'user', content: prompt }
        ],
      });
      console.log(response.content[0].text);
      return response.content[0].text;
  } catch (error) {
    console.error('Error generating text with Ollama:', error.message);
    throw new Error('Failed to generate text with AI model');
  }
};

/**
 * Generate embeddings with Ollama
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<number[]>} - Embedding vector
 */
const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(`${OLLAMA_API_URL}/embeddings`, {
      model: EMBEDDING_MODEL,
      prompt: text
    });
    
    return response.data.embedding;
  } catch (error) {
    console.error('Error generating embeddings with Ollama:', error.message);
    throw new Error('Failed to generate embeddings');
  }
};

/**
 * Process a resume and generate structured data and embeddings
 * @param {string} userId - User ID
 * @param {string} resumeId - Resume ID
 * @param {string} resumeText - Raw text from resume
 * @returns {Promise<object>} - Structured resume data
 */
const processResume = async (userId, resumeId, resumeText) => {
  try {
    // Generate structured data from resume
    const prompt = `
      You are an expert resume parser. Extract structured information from the following resume.
      Format your response as JSON with the following structure:
      {
        "personalInfo": {
          "fullName": "",
          "email": "",
          "phone": "",
          "address": "",
          "linkedin": "",
          "website": "",
          "summary": ""
        },
        "education": [
          {
            "institution": "",
            "degree": "",
            "fieldOfStudy": "",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "isOngoing": false,
            "gpa": "",
            "achievements": []
          }
        ],
        "experience": [
          {
            "company": "",
            "position": "",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "isCurrentJob": false,
            "location": "",
            "description": "",
            "achievements": [],
            "skills": []
          }
        ],
        "skills": [
          {
            "name": "",
            "level": "",
            "category": ""
          }
        ],
        "projects": [
          {
            "name": "",
            "description": "",
            "technologies": []
          }
        ],
        "certifications": [
          {
            "name": "",
            "issuingOrganization": "",
            "issueDate": "YYYY-MM-DD"
          }
        ],
        "languages": [
          {
            "name": "",
            "proficiency": ""
          }
        ]
      }
      
      Resume text:
      ${resumeText}

      Respond with only the JSON object, nothing else.
    `;
    
    const responseText = await generateText(prompt, {temperature: 0.2});
    let structuredData;
    
    try {
      // Try to parse JSON from the response
      structuredData = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing JSON from AI response:', error);
      
      // Try to extract JSON if it's wrapped in markdown or other text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          structuredData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          throw new Error('Failed to parse resume data');
        }
      } else {
        throw new Error('Failed to parse resume data');
      }
    }
    
    // Update resume with structured data
    await Resume.findByIdAndUpdate(resumeId, {
      isProcessed: true,
      ...structuredData,
      rawText: resumeText
    });
    
    // Generate and store embeddings for different sections
    await generateAndStoreEmbeddings(userId, resumeId, structuredData, resumeText);
    
    // Update user to indicate they have a processed resume
    await User.findByIdAndUpdate(userId, {
      hasResume: true
    });
    
    return structuredData;
  } catch (error) {
    console.error('Error processing resume:', error);
    
    // Mark resume as having a processing error
    await Resume.findByIdAndUpdate(resumeId, {
      isProcessed: false,
      processingError: error.message
    });
    
    throw error;
  }
};

/**
 * Generate and store embeddings for resume sections
 * @param {string} userId - User ID
 * @param {string} resumeId - Resume ID
 * @param {object} structuredData - Structured resume data
 * @param {string} rawText - Raw resume text
 */
const generateAndStoreEmbeddings = async (userId, resumeId, structuredData, rawText) => {
  try {
    // Delete any existing embeddings for this resume
    await Embedding.deleteMany({ resume: resumeId });
    
    const embeddingsToStore = [];
    
    // Personal info embeddings
    if (structuredData.personalInfo) {
      const personalText = `
        Name: ${structuredData.personalInfo.fullName || ''}
        Contact: ${structuredData.personalInfo.email || ''} ${structuredData.personalInfo.phone || ''}
        Address: ${structuredData.personalInfo.address || ''}
        Online: ${structuredData.personalInfo.linkedin || ''} ${structuredData.personalInfo.website || ''}
        Summary: ${structuredData.personalInfo.summary || ''}
      `;
      
      const personalVector = await generateEmbedding(personalText);
      
      embeddingsToStore.push({
        user: userId,
        resume: resumeId,
        segmentType: 'personal',
        text: personalText,
        vector: personalVector,
        metadata: structuredData.personalInfo
      });
    }
    
    // Education embeddings
    if (structuredData.education && structuredData.education.length > 0) {
      for (const edu of structuredData.education) {
        const eduText = `
          Education at ${edu.institution || ''}
          Degree: ${edu.degree || ''} in ${edu.fieldOfStudy || ''}
          Duration: ${edu.startDate || ''} to ${edu.isOngoing ? 'Present' : (edu.endDate || '')}
          GPA: ${edu.gpa || ''}
          Achievements: ${edu.achievements ? edu.achievements.join(', ') : ''}
          ${edu.description || ''}
        `;
        
        const eduVector = await generateEmbedding(eduText);
        
        embeddingsToStore.push({
          user: userId,
          resume: resumeId,
          segmentType: 'education',
          segmentId: edu._id || String(Math.random()),
          text: eduText,
          vector: eduVector,
          metadata: edu
        });
      }
    }
    
    // Experience embeddings
    if (structuredData.experience && structuredData.experience.length > 0) {
      for (const exp of structuredData.experience) {
        const expText = `
          Work experience at ${exp.company || ''} as ${exp.position || ''}
          Duration: ${exp.startDate || ''} to ${exp.isCurrentJob ? 'Present' : (exp.endDate || '')}
          Location: ${exp.location || ''}
          Description: ${exp.description || ''}
          Achievements: ${exp.achievements ? exp.achievements.join(', ') : ''}
          Skills: ${exp.skills ? exp.skills.join(', ') : ''}
        `;
        
        const expVector = await generateEmbedding(expText);
        
        embeddingsToStore.push({
          user: userId,
          resume: resumeId,
          segmentType: 'experience',
          segmentId: exp._id || String(Math.random()),
          text: expText,
          vector: expVector,
          metadata: exp
        });
      }
    }
    
    // Skills embeddings
    if (structuredData.skills && structuredData.skills.length > 0) {
      // Group skills by category
      const skillCategories = {};
      
      for (const skill of structuredData.skills) {
        const category = skill.category || 'General';
        
        if (!skillCategories[category]) {
          skillCategories[category] = [];
        }
        
        skillCategories[category].push(skill);
      }
      
      // Create embedding for each skill category
      for (const [category, skills] of Object.entries(skillCategories)) {
        const skillText = `
          Skills in ${category}:
          ${skills.map(s => `${s.name || ''} - Level: ${s.level || 'Not specified'}`).join('\n')}
        `;
        
        const skillVector = await generateEmbedding(skillText);
        
        embeddingsToStore.push({
          user: userId,
          resume: resumeId,
          segmentType: 'skill',
          segmentId: category,
          text: skillText,
          vector: skillVector,
          metadata: { category, skills }
        });
      }
    }
    
    // Projects embeddings
    if (structuredData.projects && structuredData.projects.length > 0) {
      for (const project of structuredData.projects) {
        const projectText = `
          Project: ${project.name || ''}
          Description: ${project.description || ''}
          Technologies: ${project.technologies ? project.technologies.join(', ') : ''}
        `;
        
        const projectVector = await generateEmbedding(projectText);
        
        embeddingsToStore.push({
          user: userId,
          resume: resumeId,
          segmentType: 'project',
          segmentId: project._id || String(Math.random()),
          text: projectText,
          vector: projectVector,
          metadata: project
        });
      }
    }
    
    // Save all embeddings
    if (embeddingsToStore.length > 0) {
      await Embedding.insertMany(embeddingsToStore);
    }
    
  } catch (error) {
    console.error('Error generating and storing embeddings:', error);
    throw error;
  }
};

/**
 * Find relevant resume information for a given form field
 * @param {string} userId - User ID
 * @param {object} formField - Form field data
 * @returns {Promise<object>} - Suggestion with confidence level
 */
const getSuggestionForField = async (userId, formField) => {
  try {
    // Get user info to check if they have a resume
    const user = await User.findById(userId).select('hasResume');
    
    if (!user || !user.hasResume) {
      return {
        suggestion: '',
        confidence: 'red'
      };
    }
    
    // Get resume
    const resume = await Resume.findOne({ user: userId, isProcessed: true });
    
    if (!resume) {
      return {
        suggestion: '',
        confidence: 'red'
      };
    }
    
    // Generate embedding for the field name/label
    const fieldQuery = `${formField.fieldName} ${formField.label || ''} ${formField.placeholder || ''}`.trim();
    const fieldEmbedding = await generateEmbedding(fieldQuery);
    
    // Find similar resume sections based on embedding similarity
    const embeddings = await Embedding.find({ user: userId });
    
    // Calculate similarity scores and find best matches
    const similarityScores = embeddings.map(embedding => {
      // Calculate cosine similarity
      const dotProduct = fieldEmbedding.reduce((sum, val, i) => sum + val * embedding.vector[i], 0);
      const mag1 = Math.sqrt(fieldEmbedding.reduce((sum, val) => sum + val * val, 0));
      const mag2 = Math.sqrt(embedding.vector.reduce((sum, val) => sum + val * val, 0));
      const similarity = dotProduct / (mag1 * mag2);
      
      return {
        embedding,
        similarity
      };
    });
    
    // Sort by similarity
    similarityScores.sort((a, b) => b.similarity - a.similarity);
    
    // Get top 3 most similar sections
    const topMatches = similarityScores.slice(0, 3);
    
    if (topMatches.length === 0 || topMatches[0].similarity < 0.7) {
      // No good matches found, try direct field matching
      return getDirectFieldMatch(resume, formField);
    }
    
    // Generate a suggestion based on the top matches
    const prompt = `
      You are an AI assistant helping with job applications.
      
      Job application form field:
      - Field name: ${formField.fieldName}
      - Field label: ${formField.label || 'N/A'}
      - Field placeholder: ${formField.placeholder || 'N/A'}
      - Field type: ${formField.fieldType || 'text'}
      
      Relevant resume sections:
      ${topMatches.map((match, i) => `
        Section ${i + 1} (${match.embedding.segmentType}):
        ${match.embedding.text}
      `).join('\n')}
      
      Based on the resume data above, provide the most appropriate value for this job application field.
      Only provide the exact text that should be entered in the field, without any explanation.
      If you cannot determine an appropriate value, respond with an empty string.
    `;
    
    const suggestionText = await generateText(prompt);
    
    // Determine confidence level based on similarity score
    let confidence = 'red';
    
    if (topMatches[0].similarity > 0.9) {
      confidence = 'green';
    } else if (topMatches[0].similarity > 0.75) {
      confidence = 'yellow';
    }
    
    return {
      suggestion: suggestionText.trim(),
      confidence
    };
    
  } catch (error) {
    console.error('Error getting suggestion for field:', error);
    
    return {
      suggestion: '',
      confidence: 'red'
    };
  }
};

/**
 * Get direct field match from resume when semantic search doesn't yield good results
 * @param {object} resume - Resume document
 * @param {object} formField - Form field data
 * @returns {Promise<object>} - Suggestion with confidence level
 */
const getDirectFieldMatch = (resume, formField) => {
  const fieldName = formField.fieldName.toLowerCase();
  const fieldLabel = (formField.label || '').toLowerCase();
  const fieldPlaceholder = (formField.placeholder || '').toLowerCase();
  
  // Common field name patterns and their corresponding resume data
  const fieldPatterns = {
    // Name patterns
    name: resume.personalInfo.fullName,
    'full name': resume.personalInfo.fullName,
    'first name': resume.personalInfo.fullName ? resume.personalInfo.fullName.split(' ')[0] : null,
    'last name': resume.personalInfo.fullName ? resume.personalInfo.fullName.split(' ').slice(-1)[0] : null,
    
    // Contact patterns
    email: resume.personalInfo.email,
    'e-mail': resume.personalInfo.email,
    phone: resume.personalInfo.phone,
    telephone: resume.personalInfo.phone,
    mobile: resume.personalInfo.phone,
    
    // Address patterns
    address: resume.personalInfo.address,
    'street address': resume.personalInfo.address,
    city: resume.personalInfo.city,
    state: resume.personalInfo.state,
    zip: resume.personalInfo.zipCode,
    'zip code': resume.personalInfo.zipCode,
    'postal code': resume.personalInfo.zipCode,
    country: resume.personalInfo.country,
    
    // Online presence
    linkedin: resume.personalInfo.linkedin,
    website: resume.personalInfo.website,
    
    // Summary
    summary: resume.personalInfo.summary,
    'professional summary': resume.personalInfo.summary,
    'about me': resume.personalInfo.summary,
    objective: resume.personalInfo.summary,
    
    // Education (most recent)
    'highest education': resume.education && resume.education.length > 0 ? 
      `${resume.education[0].degree} in ${resume.education[0].fieldOfStudy} from ${resume.education[0].institution}` : null,
    'education level': resume.education && resume.education.length > 0 ? resume.education[0].degree : null,
    school: resume.education && resume.education.length > 0 ? resume.education[0].institution : null,
    college: resume.education && resume.education.length > 0 ? resume.education[0].institution : null,
    university: resume.education && resume.education.length > 0 ? resume.education[0].institution : null,
    degree: resume.education && resume.education.length > 0 ? resume.education[0].degree : null,
    
    // Experience (most recent)
    'current company': resume.experience && resume.experience.length > 0 ? 
      (resume.experience[0].isCurrentJob ? resume.experience[0].company : null) : null,
    'current position': resume.experience && resume.experience.length > 0 ? 
      (resume.experience[0].isCurrentJob ? resume.experience[0].position : null) : null,
    'years of experience': resume.experience && resume.experience.length > 0 ? 
      calculateExperienceYears(resume.experience) : null
  };
  
  // Check field patterns for matches
  for (const [pattern, value] of Object.entries(fieldPatterns)) {
    if ((fieldName.includes(pattern) || fieldLabel.includes(pattern) || fieldPlaceholder.includes(pattern)) && value) {
      return {
        suggestion: value,
        confidence: 'yellow' // Direct matches are mostly good but may need review
      };
    }
  }
  
  // Skills special case - check if field is asking for a specific skill or skill list
  if (fieldName.includes('skill') || fieldLabel.includes('skill')) {
    if (resume.skills && resume.skills.length > 0) {
      const skillList = resume.skills.map(s => s.name).join(', ');
      return {
        suggestion: skillList,
        confidence: 'yellow'
      };
    }
  }
  
  // No direct match found
  return {
    suggestion: '',
    confidence: 'red'
  };
};

/**
 * Calculate total years of experience from experience array
 * @param {Array} experiences - Array of experience objects
 * @returns {number} - Total years of experience
 */
const calculateExperienceYears = (experiences) => {
  let totalMonths = 0;
  
  for (const exp of experiences) {
    const startDate = exp.startDate ? new Date(exp.startDate) : null;
    let endDate = exp.endDate ? new Date(exp.endDate) : null;
    
    if (!startDate) continue;
    
    // If current job or no end date, use current date
    if (exp.isCurrentJob || !endDate) {
      endDate = new Date();
    }
    
    // Calculate months between dates
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    
    totalMonths += Math.max(0, months); // Avoid negative months
  }
  
  // Convert to years (rounded to 1 decimal place)
  return Math.round(totalMonths / 12 * 10) / 10;
};

/**
 * Process field suggestions for a job application form
 * @param {string} userId - User ID
 * @param {object} formData - Form data with fields
 * @returns {Promise<object>} - Suggestions for each field
 */
const processFormSuggestions = async (userId, formData) => {
  try {
    const suggestions = { fields: [] };
    
    // Process each field
    for (const field of formData.fields) {
      const suggestion = await getSuggestionForField(userId, field);
      
      suggestions.fields.push({
        fieldId: field.fieldId,
        value: suggestion.suggestion,
        confidence: suggestion.confidence
      });
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error processing form suggestions:', error);
    throw error;
  }
};

/**
 * Process feedback to improve AI suggestions
 * @param {string} userId - User ID
 * @param {object} feedbackData - Feedback data
 * @returns {Promise<boolean>} - Success indicator
 */
const processFeedback = async (userId, feedbackData) => {
  try {
    // This function would typically update a learning model or store feedback
    // for future improvements. For now, we'll just log it.
    console.log(`Feedback received from user ${userId}:`, feedbackData);
    
    // In a production system, we would use this feedback to finetune the model
    // or update a vector database with improved associations
    
    return true;
  } catch (error) {
    console.error('Error processing feedback:', error);
    throw error;
  }
};

/**
 * Generate resume insights for optimization
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Resume insights
 */
const generateResumeInsights = async (userId) => {
  try {
    // Get user's resume
    const resume = await Resume.findOne({ user: userId, isProcessed: true });
    if (!resume) {
      throw new Error('No processed resume found');
    }
    
    // Generate insights using AI
    const prompt = `
      You are an expert resume reviewer. Based on the following resume, provide 3-5 actionable insights
      for improving the resume. Focus on identifying strengths, weaknesses, and specific optimization suggestions.
      
      Format your response as JSON with the following structure:
      {
        "strengths": ["strength 1", "strength 2", ...],
        "weaknesses": ["weakness 1", "weakness 2", ...],
        "suggestions": ["suggestion 1", "suggestion 2", ...],
        "keywordOptimization": ["keyword 1", "keyword 2", ...]
      }
      
      Resume data:
      ${JSON.stringify(resume)}
    `;
    
    const responseText = await generateText(prompt);
    let insights;
    
    try {
      // Try to parse JSON from the response
      insights = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing JSON from AI response:', error);
      
      // Try to extract JSON if it's wrapped in markdown or other text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          insights = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          throw new Error('Failed to parse resume insights');
        }
      } else {
        throw new Error('Failed to parse resume insights');
      }
    }

    if (
        !insights ||
        !Array.isArray(insights.strengths) ||
        !Array.isArray(insights.weaknesses) ||
        !Array.isArray(insights.suggestions) ||
        !Array.isArray(insights.keywordOptimization)
      ) {
        console.error('Insights shape invalid:', insights);
        throw new Error('Invalid resume insights format');
      }
    
    return insights;
  } catch (error) {
    console.error('Error generating resume insights:', error);
    throw error;
  }
};

module.exports = {
  generateText,
  generateEmbedding,
  processResume,
  getSuggestionForField,
  processFormSuggestions,
  processFeedback,
  generateResumeInsights
};

/* 
// OpenAI implementation alternative (commented out as per request)
const { OpenAI } = require('openai');

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateTextWithOpenAI = async (prompt, options = {}) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    throw new Error('Failed to generate text with AI model');
  }
};

const generateEmbeddingWithOpenAI = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings with OpenAI:', error);
    throw new Error('Failed to generate embeddings');
  }
};
*/