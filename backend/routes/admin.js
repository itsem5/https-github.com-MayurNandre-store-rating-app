const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// Dashboard statistics (admin only)
router.get('/dashboard-stats', auth, authorize('admin'), getDashboardStats);

module.exports = router;