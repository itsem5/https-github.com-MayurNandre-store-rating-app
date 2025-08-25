const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address')
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must be maximum 400 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const passwordUpdateValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
    .withMessage('New password must be 8-16 characters with at least one uppercase letter and one special character')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.put('/password', auth, passwordUpdateValidation, updatePassword);

module.exports = router;