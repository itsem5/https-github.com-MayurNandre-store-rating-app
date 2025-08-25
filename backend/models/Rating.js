'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // A rating belongs to a user
      Rating.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      // A rating belongs to a store
      Rating.belongsTo(models.Store, {
        foreignKey: 'storeId',
        as: 'store'
      });
    }
  }

  Rating.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Rating must be at least 1'
        },
        max: {
          args: 5,
          msg: 'Rating must be at most 5'
        }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'storeId']
      }
    ]
  });

  return Rating;
};