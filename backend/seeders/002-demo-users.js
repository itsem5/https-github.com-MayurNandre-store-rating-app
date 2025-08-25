'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        name: 'John Smith Customer User',
        email: 'john.smith@email.com',
        password: await bcrypt.hash('User@123!', 12),
        address: '456 Main Street, Downtown, DT 67890',
        role: 'user'
      },
      {
        name: 'Emily Johnson Regular User',
        email: 'emily.johnson@email.com',
        password: await bcrypt.hash('User@456!', 12),
        address: '789 Oak Avenue, Suburb, SB 11111',
        role: 'user'
      },
      {
        name: 'Michael Brown Customer User',
        email: 'michael.brown@email.com',
        password: await bcrypt.hash('User@789!', 12),
        address: '321 Pine Street, Uptown, UT 22222',
        role: 'user'
      },
      {
        name: 'Sarah Davis Coffee Store Owner',
        email: 'sarah@bestcoffee.com',
        password: await bcrypt.hash('Store@123!', 12),
        address: '100 Coffee Lane, Bean City, BC 33333',
        role: 'store_owner'
      },
      {
        name: 'Pizza Palace Restaurant Owner',
        email: 'contact@pizzapalace.com',
        password: await bcrypt.hash('Store@456!', 12),
        address: '200 Pizza Boulevard, Food District, FD 44444',
        role: 'store_owner'
      },
      {
        name: 'Tech Gadgets Store Owner Name',
        email: 'info@techgadgets.com',
        password: await bcrypt.hash('Store@789!', 12),
        address: '300 Electronics Street, Tech Hub, TH 55555',
        role: 'store_owner'
      }
    ];

    const usersWithTimestamps = users.map(user => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('users', usersWithTimestamps, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'john.smith@email.com',
          'emily.johnson@email.com',
          'michael.brown@email.com',
          'sarah@bestcoffee.com',
          'contact@pizzapalace.com',
          'info@techgadgets.com'
        ]
      }
    }, {});
  }
};