const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    // Get users by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    // Get average rating across all stores
    const averageRating = await Rating.findOne({
      attributes: [
        [Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')), 'average']
      ]
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    const recentRatings = await Rating.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Top rated stores
    const topStores = await Store.findAll({
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: []
      }],
      attributes: [
        'id',
        'name',
        [Rating.sequelize.fn('AVG', Rating.sequelize.col('ratings.rating')), 'averageRating'],
        [Rating.sequelize.fn('COUNT', Rating.sequelize.col('ratings.id')), 'totalRatings']
      ],
      group: ['Store.id'],
      having: Rating.sequelize.where(
        Rating.sequelize.fn('COUNT', Rating.sequelize.col('ratings.id')), 
        '>', 0
      ),
      order: [[Rating.sequelize.literal('averageRating'), 'DESC']],
      limit: 5
    });

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
      averageRating: parseFloat(averageRating?.dataValues?.average || 0).toFixed(1),
      usersByRole: usersByRole.map(ur => ({
        role: ur.role,
        count: parseInt(ur.dataValues.count)
      })),
      recentActivity: {
        newUsers: recentUsers,
        newRatings: recentRatings
      },
      topStores: topStores.map(store => ({
        id: store.id,
        name: store.name,
        averageRating: parseFloat(store.dataValues.averageRating).toFixed(1),
        totalRatings: parseInt(store.dataValues.totalRatings)
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getDashboardStats
};