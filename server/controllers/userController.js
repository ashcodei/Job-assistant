/**
 * User Controller
 * Handles user profile management
 */

const User = require('../models/User');
const Resume = require('../models/Resume');

/**
 * Get current user profile
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      user
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, dateOfBirth, gender, phone, linkedIn } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (gender) user.gender = gender;
    if (phone) user.phone = phone;
    if (linkedIn) user.linkedIn = linkedIn;
    
    // Save user
    await user.save();
    
    // Return updated user
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        linkedIn: user.linkedIn,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Only allow password change for email auth type
    if (user.authType !== 'email') {
      return res.status(400).json({
        error: 'Password cannot be changed for accounts using social login'
      });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get user resume status
 */
exports.getResumeStatus = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.user.id).select('hasResume');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Get resume info if it exists
    let resumeInfo = null;
    
    if (user.hasResume) {
      const resume = await Resume.findOne({ user: req.user.id }).select('fileName fileType createdAt isProcessed');
      
      if (resume) {
        resumeInfo = {
          fileName: resume.fileName,
          fileType: resume.fileType,
          uploadDate: resume.createdAt,
          isProcessed: resume.isProcessed
        };
      }
    }
    
    res.status(200).json({
      hasResume: user.hasResume,
      resumeInfo
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    // Find and delete user
    const user = await User.findByIdAndDelete(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Delete associated resume
    await Resume.deleteMany({ user: req.user.id });
    
    // Additional cleanup for other models can be added here
    
    res.status(200).json({
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get basic user stats
 */
exports.getUserStats = async (req, res, next) => {
  try {
    // Find user to verify they exist
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Get resume data if available
    const resume = user.hasResume ? 
      await Resume.findOne({ user: req.user.id }).select('isProcessed') : 
      null;
    
    // Get application count (will implement later when we have the Application model)
    const applicationCount = 0; // Placeholder for now
    
    res.status(200).json({
      stats: {
        hasResume: user.hasResume,
        resumeProcessed: resume ? resume.isProcessed : false,
        profileComplete: Boolean(
          user.name && 
          user.email && 
          (user.phone || user.linkedIn) && 
          user.hasResume
        ),
        applicationCount
      }
    });
    
  } catch (error) {
    next(error);
  }
};