const express = require('express');
const { body, param, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address')
    .isLength({ min: 1, max: 400 })
    .withMessage('Address is required and must be maximum 400 characters')
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner')
];

const updateUserValidation = [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('name')
    .optional()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('address')
    .optional()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must be maximum 400 characters')
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner')
];

const getUserValidation = [
  param('id').isInt().withMessage('User ID must be an integer')
];

const listUsersValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['name', 'email', 'role', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
  query('name').optional().isString().trim(),
  query('email').optional().isString().trim(),
  query('address').optional().isString().trim(),
  query('role').optional().isIn(['admin', 'user', 'store_owner']).withMessage('Invalid role filter')
];

// Routes

// Get user statistics (admin only)
router.get('/stats', auth, authorize('admin'), getUserStats);

// List all users with filtering and pagination (admin only)
router.get('/', auth, authorize('admin'), listUsersValidation, getAllUsers);

// Get specific user by ID (admin only)
router.get('/:id', auth, authorize('admin'), getUserValidation, getUserById);

// Create new user (admin only)
router.post('/', auth, authorize('admin'), createUserValidation, createUser);

// Update user (admin only)
router.put('/:id', auth, authorize('admin'), updateUserValidation, updateUser);

// Delete user (admin only)
router.delete('/:id', auth, authorize('admin'), getUserValidation, deleteUser);

module.exports = router;