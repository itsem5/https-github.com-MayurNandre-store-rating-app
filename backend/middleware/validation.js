const { validationResult } = require('express-validator');

// Generic validation result handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Validation middleware for common patterns
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({ 
      message: 'Page must be a positive integer' 
    });
  }
  
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({ 
      message: 'Limit must be between 1 and 100' 
    });
  }
  
  next();
};

const validateSorting = (allowedFields = []) => {
  return (req, res, next) => {
    const { sortBy, sortOrder } = req.query;
    
    if (sortBy && !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Sort field must be one of: ${allowedFields.join(', ')}`
      });
    }
    
    if (sortOrder && !['ASC', 'DESC', 'asc', 'desc'].includes(sortOrder)) {
      return res.status(400).json({
        message: 'Sort order must be ASC or DESC'
      });
    }
    
    next();
  };
};

// Custom validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  return passwordRegex.test(password);
};

const isValidName = (name) => {
  return name && name.trim().length >= 20 && name.trim().length <= 60;
};

const isValidAddress = (address) => {
  return address && address.trim().length >= 1 && address.trim().length <= 400;
};

const isValidRole = (role) => {
  return ['admin', 'user', 'store_owner'].includes(role);
};

const isValidRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

// Sanitization functions
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' '); // Remove extra whitespace
};

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
};

// Middleware to sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        if (key === 'email') {
          req.body[key] = sanitizeEmail(req.body[key]);
        } else {
          req.body[key] = sanitizeString(req.body[key]);
        }
      }
    });
  }
  next();
};

// Rate limiting validation
const validateRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const requestData = requests.get(ip);
    
    if (now > requestData.resetTime) {
      requestData.count = 1;
      requestData.resetTime = now + windowMs;
      return next();
    }
    
    if (requestData.count >= max) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }
    
    requestData.count++;
    next();
  };
};

module.exports = {
  handleValidationErrors,
  validatePagination,
  validateSorting,
  sanitizeBody,
  validateRateLimit,
  // Validation functions
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
  isValidRole,
  isValidRating,
  // Sanitization functions
  sanitizeString,
  sanitizeEmail
};