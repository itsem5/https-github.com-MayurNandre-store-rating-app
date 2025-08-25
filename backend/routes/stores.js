const express = require('express');
const { body, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRatings,
  searchStores
} = require('../controllers/storeController');

const router = express.Router();

const storeValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('address')
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must be maximum 400 characters')
];

const searchValidation = [
  query('name').optional().isString(),
  query('address').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

// Public routes
router.get('/', getAllStores);
router.get('/search', searchValidation, searchStores);
router.get('/:id', getStoreById);
router.get('/:id/ratings', getStoreRatings);

// Protected routes
router.post('/', auth, authorize('admin'), storeValidation, createStore);
router.put('/:id', auth, authorize('admin', 'store_owner'), storeValidation, updateStore);
router.delete('/:id', auth, authorize('admin'), deleteStore);

module.exports = router;