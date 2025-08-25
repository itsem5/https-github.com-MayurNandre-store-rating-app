const express = require('express');
const { body, param, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
  submitOrUpdateRating,
  getRatingsForStore,
  getRatingsByUser,
  deleteRating,
  getRatingStats
} = require('../controllers/ratingController');

const router = express.Router();

// Validation rules
const ratingValidation = [
  body('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a valid positive integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment must be maximum 1000 characters')
    .trim()
];

const storeParamValidation = [
  param('storeId').isInt().withMessage('Store ID must be an integer')
];

const ratingParamValidation = [
  param('id').isInt().withMessage('Rating ID must be an integer')
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['rating', 'createdAt', 'updatedAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
];

// Routes

// Get rating statistics (admin only)
router.get('/stats', auth, authorize('admin'), getRatingStats);

// Get all ratings by the current user
router.get('/my', auth, paginationValidation, getRatingsByUser);

// Get all ratings for a specific store (public endpoint)
router.get('/store/:storeId', storeParamValidation, paginationValidation, getRatingsForStore);

// Submit new rating or update existing rating (normal users only)
router.post('/', auth, authorize('user'), ratingValidation, submitOrUpdateRating);

// Delete a rating (user can delete their own, admin can delete any)
router.delete('/:id', auth, ratingParamValidation, deleteRating);

module.exports = router;