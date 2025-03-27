/**
 * Resume Controller
 * Handles resume upload, processing, and retrieval
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const multer = require('multer');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Use user ID and timestamp to create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    // Accept only doc, docx, and pdf files
    const allowedMimeTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/pdf', // .pdf
      'application/vnd.oasis.opendocument.text', // .odt
      'text/plain' // .txt
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a DOC, DOCX, PDF, ODT, or TXT file.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
}).single('resume');

// Promisify upload middleware
const uploadMiddleware = promisify(upload);

/**
 * Upload resume file
 */
exports.uploadResume = async (req, res, next) => {
  try {
    // Use multer middleware
    await uploadMiddleware(req, res);
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No resume file provided'
      });
    }
    
    const userId = req.user.id;
    const file = req.file;
    
    // Create or update resume entry
    const resumeData = {
      user: userId,
      fileName: file.originalname,
      fileUrl: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      isProcessed: false
    };
    
    // Check if user already has a resume
    const existingResume = await Resume.findOne({ user: userId });
    
    if (existingResume) {
      // Delete old file if exists
      if (existingResume.fileUrl && fs.existsSync(existingResume.fileUrl)) {
        fs.unlinkSync(existingResume.fileUrl);
      }
      
      // Update existing resume
      Object.assign(existingResume, resumeData);
      await existingResume.save();
      
      // Extract text and process resume
      const resumeText = await extractTextFromResume(file);
      
      // Process resume asynchronously
      processResumeAsync(userId, existingResume._id, resumeText);
      
      res.status(200).json({
        message: 'Resume updated successfully',
        resume: {
          id: existingResume._id,
          fileName: existingResume.fileName,
          fileType: existingResume.fileType,
          uploadDate: existingResume.createdAt,
          isProcessing: true
        }
      });
    } else {
      // Create new resume
      const resume = new Resume(resumeData);
      await resume.save();
      
      // Mark user as having a resume
      await User.findByIdAndUpdate(userId, { hasResume: true });
      
      // Extract text and process resume
      const resumeText = await extractTextFromResume(file);
      
      // Process resume asynchronously
      processResumeAsync(userId, resume._id, resumeText);
      
      res.status(201).json({
        message: 'Resume uploaded successfully',
        resume: {
          id: resume._id,
          fileName: resume.fileName,
          fileType: resume.fileType,
          uploadDate: resume.createdAt,
          isProcessing: true
        }
      });
    }
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size exceeds 5MB limit'
      });
    }
    
    next(error);
  }
};

/**
 * Extract text from resume file based on file type
 * @param {Object} file - Uploaded file object
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromResume = async (file) => {
  try {
    const filePath = file.path;
    const fileType = file.mimetype;
    
    let text = '';
    
    if (fileType === 'application/pdf') {
      // Parse PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (fileType === 'application/msword' || 
               fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOC/DOCX
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (fileType === 'application/vnd.oasis.opendocument.text') {
      // Parse ODT
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (fileType === 'text/plain') {
      // Read text file
      text = fs.readFileSync(filePath, 'utf8');
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    throw error;
  }
};

/**
 * Process resume asynchronously
 * @param {string} userId - User ID
 * @param {string} resumeId - Resume ID
 * @param {string} resumeText - Extracted text from resume
 */
const processResumeAsync = async (userId, resumeId, resumeText) => {
  try {
    // Process resume with AI service
    await aiService.processResume(userId, resumeId, resumeText);
    
    // Update resume status
    await Resume.findByIdAndUpdate(resumeId, {
      isProcessed: true
    });
    
    console.log(`Resume ${resumeId} processed successfully`);
  } catch (error) {
    console.error(`Error processing resume ${resumeId}:`, error);
    
    // Update resume with error
    await Resume.findByIdAndUpdate(resumeId, {
      isProcessed: false,
      processingError: error.message
    });
  }
};

/**
 * Get resume status
 */
exports.getResumeStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find resume
    const resume = await Resume.findOne({ user: userId }).select('fileName fileType fileSize createdAt isProcessed processingError');
    
    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found'
      });
    }
    
    res.status(200).json({
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        uploadDate: resume.createdAt,
        isProcessed: resume.isProcessed,
        processingError: resume.processingError
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get parsed resume data
 */
exports.getResumeData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find resume
    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found'
      });
    }
    
    if (!resume.isProcessed) {
      return res.status(400).json({
        error: 'Resume is still being processed',
        isProcessing: true
      });
    }
    
    // Extract required data
    const resumeData = {
      personalInfo: resume.personalInfo,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      languages: resume.languages
    };
    
    res.status(200).json({ resumeData });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete resume
 */
exports.deleteResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find resume
    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found'
      });
    }
    
    // Delete file
    if (resume.fileUrl && fs.existsSync(resume.fileUrl)) {
      fs.unlinkSync(resume.fileUrl);
    }
    
    // Delete resume from database
    await Resume.findByIdAndDelete(resume._id);
    
    // Update user
    await User.findByIdAndUpdate(userId, { hasResume: false });
    
    res.status(200).json({
      message: 'Resume deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Download resume file
 */
exports.downloadResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find resume
    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found'
      });
    }
    
    // Check if file exists
    if (!resume.fileUrl || !fs.existsSync(resume.fileUrl)) {
      return res.status(404).json({
        error: 'Resume file not found'
      });
    }
    
    // Set content type and disposition
    res.setHeader('Content-Type', resume.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${resume.fileName}"`);
    
    // Stream file
    const fileStream = fs.createReadStream(resume.fileUrl);
    fileStream.pipe(res);
    
  } catch (error) {
    next(error);
  }
};