/**
 * Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';

/**
 * Middleware to protect routes
 * Verifies JWT token and adds user to request
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        error: 'Not authorized to access this resource'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Add user to request object
      req.user = { id: decoded.id, email: decoded.email };
      
      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Not authorized to access this resource'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 * but adds user to request if token is valid
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If token exists, verify it and add user to request
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email };
      } catch (error) {
        // Invalid token, but continue without user
        req.user = null;
      }
    } else {
      // No token, continue without user
      req.user = null;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin only middleware
 * Requires the protect middleware to be used first
 */
exports.adminOnly = async (req, res, next) => {
  try {
    // User should already be in request from protect middleware
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized to access this resource'
      });
    }
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};