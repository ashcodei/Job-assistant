/**
 * Authentication Controller
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/emailService');

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already in use. Please try a different email or login instead.'
      });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create new user
    const user = new User({
      email,
      password,
      name,
      authType: 'email',
      verificationToken,
      isVerified: false
    });
    
    // Save user to database
    await user.save();
    
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify your JobsAI account',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `
        <h1>Welcome to JobsAI!</h1>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, you can also click on this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      `
    });
    
    // Return success without token (user needs to verify first)
    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.'
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // Find user with matching verification token
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token'
      });
    }
    
    // Mark user as verified and remove token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    
    // Generate JWT
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.status(200).json({
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Login with email and password
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    
    // Check if user is verified
    if (!user.isVerified && user.authType === 'email') {
      return res.status(403).json({
        error: 'Please verify your email before logging in',
        needsVerification: true
      });
    }
    
    // Check password if auth type is email
    if (user.authType === 'email') {
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Google OAuth authentication
exports.googleAuth = async (req, res, next) => {
  try {
    const { googleToken, email, name, picture } = req.body;
    
    // Verify Google token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
      
      // Verify email matches
      if (payload.email !== email) {
        return res.status(401).json({
          error: 'Email verification failed'
        });
      }
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid Google token'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but registered with email/password
      if (user.authType === 'email' && !user.googleId) {
        // Link Google account to existing email account
        user.googleId = payload.sub;
        user.picture = picture || payload.picture;
        await user.save();
      }
    } else {
      // Create new user if not exists
      user = new User({
        email,
        name,
        picture: picture || payload.picture,
        googleId: payload.sub,
        authType: 'google',
        isVerified: true // Google accounts are pre-verified
      });
      
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // If user doesn't exist, still return success to prevent email enumeration
    if (!user || user.authType !== 'email') {
      return res.status(200).json({
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set reset token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Send email
    await sendEmail({
      to: email,
      subject: 'Reset Your JobsAI Password',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste it into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `
        <h1>Reset Your JobsAI Password</h1>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the button below to complete the process:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If the button doesn't work, you can also click on this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
    });
    
    res.status(200).json({
      message: 'If a user with that email exists, a password reset link has been sent.'
    });
    
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    // Find user with matching reset token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired password reset token'
      });
    }
    
    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    // Generate JWT
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.status(200).json({
      message: 'Password reset successful',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Validate token
exports.validateToken = async (req, res, next) => {
  try {
    // User is already verified by auth middleware, just return the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        hasResume: user.hasResume
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  // JWT is stateless, so just tell client to remove token
  res.status(200).json({
    message: 'Logged out successfully'
  });
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email, isVerified: false });
    
    // If user doesn't exist or is already verified, still return success
    if (!user || user.isVerified) {
      return res.status(200).json({
        message: 'If a user with that email exists and is not verified, a verification email has been sent.'
      });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify your JobsAI account',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `
        <h1>Welcome to JobsAI!</h1>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, you can also click on this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      `
    });
    
    res.status(200).json({
      message: 'If a user with that email exists and is not verified, a verification email has been sent.'
    });
    
  } catch (error) {
    next(error);
  }
};