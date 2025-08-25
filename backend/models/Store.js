'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // A store belongs to a user (store owner)
      Store.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      });
      
      // A store can have many ratings
      Store.hasMany(models.Rating, {
        foreignKey: 'storeId',
        as: 'ratings'
      });
    }

    // Calculate average rating
    async getAverageRating() {
      const ratings = await this.getRatings();
      if (ratings.length === 0) return 0;
      
      const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
      return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
    }
  }

  Store.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: 'Store name must be between 20 and 60 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 400],
          msg: 'Address must be maximum 400 characters'
        }
      }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Store',
    tableName: 'stores'
  });

  return Store;
};