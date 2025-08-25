const { Store, User, Rating } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
      name,
      address,
      role
    } = req.query;

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    const offset = (page - 1) * limit;

    const stores = await Store.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate average ratings
    const storesWithRatings = stores.rows.map(store => {
      const storeData = store.toJSON();
      if (storeData.ratings && storeData.ratings.length > 0) {
        const sum = storeData.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        storeData.averageRating = Math.round((sum / storeData.ratings.length) * 10) / 10;
      } else {
        storeData.averageRating = 0;
      }
      storeData.totalRatings = storeData.ratings ? storeData.ratings.length : 0;
      delete storeData.ratings; // Remove individual ratings for clean response
      return storeData;
    });

    res.json({
      stores: storesWithRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(stores.count / limit),
        totalItems: stores.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const searchStores = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { name, address } = req.query;
    const where = {};

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating', 'userId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['name']
          }]
        }
      ]
    });

    // Calculate average ratings and format response
    const formattedStores = stores.map(store => {
      const storeData = store.toJSON();
      
      if (storeData.ratings && storeData.ratings.length > 0) {
        const sum = storeData.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        storeData.averageRating = Math.round((sum / storeData.ratings.length) * 10) / 10;
      } else {
        storeData.averageRating = 0;
      }
      
      storeData.totalRatings = storeData.ratings ? storeData.ratings.length : 0;
      return storeData;
    });

    res.json({ stores: formattedStores });
  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { name, email, address, ownerId } = req.body;

    // If owner is specified, verify they exist and have the right role
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(404).json({ message: 'Owner not found' });
      }
      if (owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'User must have store_owner role' });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllStores,
  getStoreById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const store = await Store.findByPk(id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Rating,
            as: 'ratings',
            include: [{
              model: User,
              as: 'user',
              attributes: ['name']
            }]
          }
        ]
      });

      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      const storeData = store.toJSON();
      
      // Calculate average rating
      if (storeData.ratings && storeData.ratings.length > 0) {
        const sum = storeData.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        storeData.averageRating = Math.round((sum / storeData.ratings.length) * 10) / 10;
      } else {
        storeData.averageRating = 0;
      }

      res.json({ store: storeData });
    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },
  createStore,
  searchStores,
  updateStore: async (req, res) => {
    // Implementation similar to create but with update logic
  },
  deleteStore: async (req, res) => {
    // Implementation for store deletion (admin only)
  },
  getStoreRatings: async (req, res) => {
    // Get all ratings for a specific store
  }
};