'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have one store if they're a store owner
      User.hasOne(models.Store, {
        foreignKey: 'ownerId',
        as: 'ownedStore'
      });
      
      // A user can have many ratings
      User.hasMany(models.Rating, {
        foreignKey: 'userId',
        as: 'ratings'
      });
    }

    // Instance method to check password
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // Transform user data for JSON response (exclude password)
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      return values;
    }
  }

  User.init({
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
          msg: 'Name must be between 20 and 60 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidPassword(value) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
          if (!passwordRegex.test(value)) {
            throw new Error('Password must be 8-16 characters with at least one uppercase letter and one special character');
          }
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
    role: {
      type: DataTypes.ENUM('admin', 'user', 'store_owner'),
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user, options) => {
        if (user.password) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  return User;
};