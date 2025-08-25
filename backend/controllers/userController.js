const { User, Store, Rating } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all users with filtering (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      address, 
      role, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};
    
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }
    if (role) {
      where.role = role;
    }

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where,
      include: [
        {
          model: Store,
          as: 'ownedStore',
          required: false
        },
        {
          model: Rating,
          as: 'ratings',
          required: false,
          attributes: ['id', 'rating', 'createdAt']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Calculate additional stats for each user
    const usersWithStats = users.rows.map(user => {
      const userData = user.toJSON();
      
      if (userData.ratings && userData.ratings.length > 0) {
        userData.totalRatingsSubmitted = userData.ratings.length;
        const avgRating = userData.ratings.reduce((sum, r) => sum + r.rating, 0) / userData.ratings.length;
        userData.averageRatingGiven = Math.round(avgRating * 10) / 10;
      } else {
        userData.totalRatingsSubmitted = 0;
        userData.averageRatingGiven = 0;
      }

      // For store owners, include store rating info
      if (userData.ownedStore) {
        userData.hasStore = true;
      } else {
        userData.hasStore = false;
      }

      delete userData.ratings; // Remove detailed ratings array for clean response
      
      return userData;
    });

    res.json({
      users: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.count / limit),
        totalItems: users.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get user by ID with detailed information (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'ownedStore',
          include: [
            {
              model: Rating,
              as: 'ratings',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user.toJSON();

    // Calculate additional statistics
    userData.stats = {
      totalRatingsGiven: userData.ratings.length,
      averageRatingGiven: userData.ratings.length > 0 
        ? Math.round((userData.ratings.reduce((sum, r) => sum + r.rating, 0) / userData.ratings.length) * 10) / 10 
        : 0,
      accountAge: Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)), // days
    };

    // If store owner, calculate store statistics
    if (userData.ownedStore) {
      const storeRatings = userData.ownedStore.ratings;
      userData.stats.storeStats = {
        totalRatingsReceived: storeRatings.length,
        averageStoreRating: storeRatings.length > 0 
          ? Math.round((storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length) * 10) / 10 
          : 0,
        ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: storeRatings.filter(r => r.rating === rating).length
        }))
      };
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { name, email, password, address, role = 'user' } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hook
      address,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      message: 'Server error during user creation', 
      error: error.message 
    });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, email, address, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    // Update user fields
    await user.update({
      name: name || user.name,
      email: email || user.email,
      address: address || user.address,
      role: role || user.role
    });

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Server error during user update', 
      error: error.message 
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a store owner with a store
    const ownedStore = await Store.findOne({ where: { ownerId: id } });
    if (ownedStore) {
      return res.status(400).json({ 
        message: 'Cannot delete user who owns a store. Please delete or reassign the store first.' 
      });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Server error during user deletion', 
      error: error.message 
    });
  }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    const activeUsers = await User.findAll({
      include: [
        {
          model: Rating,
          as: 'ratings',
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          required: true
        }
      ],
      attributes: ['id']
    });

    res.json({
      totalUsers,
      usersByRole: usersByRole.map(ur => ({
        role: ur.role,
        count: parseInt(ur.dataValues.count)
      })),
      recentUsers,
      activeUsersLast30Days: activeUsers.length
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};