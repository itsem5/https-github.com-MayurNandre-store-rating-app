const { Rating, Store, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Submit or update a rating
const submitOrUpdateRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    let existingRating = await Rating.findOne({ 
      where: { userId, storeId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Store, as: 'store', attributes: ['id', 'name'] }
      ]
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      await existingRating.save();

      return res.json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        userId,
        storeId,
        rating,
        comment: comment || null
      });

      // Fetch the created rating with associations
      const ratingWithAssociations = await Rating.findByPk(newRating.id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Store, as: 'store', attributes: ['id', 'name'] }
        ]
      });

      return res.status(201).json({
        message: 'Rating submitted successfully',
        rating: ratingWithAssociations
      });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ 
      message: 'Server error during rating submission', 
      error: error.message 
    });
  }
};

// Get all ratings for a specific store
const getRatingsForStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * limit;

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await Rating.findAndCountAll({
      where: { storeId },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'name', 'email'] 
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate average rating
    const allRatings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating']
    });

    let averageRating = 0;
    if (allRatings.length > 0) {
      const sum = allRatings.reduce((total, r) => total + r.rating, 0);
      averageRating = Math.round((sum / allRatings.length) * 10) / 10;
    }

    res.json({
      store: {
        id: store.id,
        name: store.name,
        averageRating,
        totalRatings: allRatings.length
      },
      ratings: ratings.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(ratings.count / limit),
        totalItems: ratings.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all ratings by the current user
const getRatingsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const ratings = await Rating.findAndCountAll({
      where: { userId },
      include: [
        { 
          model: Store, 
          as: 'store', 
          attributes: ['id', 'name', 'address', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      ratings: ratings.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(ratings.count / limit),
        totalItems: ratings.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete a rating (user can delete their own rating)
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user owns this rating or is admin
    if (rating.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    await rating.destroy();
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get dashboard stats (admin only)
const getRatingStats = async (req, res) => {
  try {
    const totalRatings = await Rating.count();
    
    const ratingDistribution = await Rating.findAll({
      attributes: [
        'rating',
        [Rating.sequelize.fn('COUNT', Rating.sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'ASC']]
    });

    const averageRating = await Rating.findOne({
      attributes: [
        [Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')), 'average']
      ]
    });

    const recentRatings = await Rating.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Store, as: 'store', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      totalRatings,
      averageRating: parseFloat(averageRating?.dataValues?.average || 0).toFixed(1),
      ratingDistribution: ratingDistribution.map(r => ({
        rating: r.rating,
        count: parseInt(r.dataValues.count)
      })),
      recentRatings
    });
  } catch (error) {
    console.error('Get rating stats error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  submitOrUpdateRating,
  getRatingsForStore,
  getRatingsByUser,
  deleteRating,
  getRatingStats
};