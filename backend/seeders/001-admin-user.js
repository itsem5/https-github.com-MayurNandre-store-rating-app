'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin@123!', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Administrator',
        email: 'admin@demo.com',
        password: hashedPassword,
        address: '123 Admin Street, Tech City, TC 12345',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@demo.com'
    }, {});
  }
};