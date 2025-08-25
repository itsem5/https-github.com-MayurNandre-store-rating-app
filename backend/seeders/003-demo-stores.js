'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('stores', [
      {
        id: 1,
        name: 'Best Coffee Shop Downtown Location',
        email: 'sarah@bestcoffee.com',
        address: '100 Coffee Lane, Bean City, BC 33333',
        ownerId: 5, // Sarah Davis Store Owner
        createdAt: new Date('2024-01-20T11:00:00Z'),
        updatedAt: new Date('2024-01-20T11:00:00Z')
      },
      {
        id: 2,
        name: 'Pizza Palace Italian Restaurant',
        email: 'contact@pizzapalace.com',
        address: '200 Pizza Boulevard, Food District, FD 44444',
        ownerId: 6, // Pizza Palace Inc
        createdAt: new Date('2024-01-25T13:20:00Z'),
        updatedAt: new Date('2024-01-25T13:20:00Z')
      },
      {
        id: 3,
        name: 'Tech Gadgets Central Electronics Store',
        email: 'info@techgadgets.com',
        address: '300 Electronics Street, Tech Hub, TH 55555',
        ownerId: 7, // Tech Gadgets Store Owner
        createdAt: new Date('2024-02-01T08:30:00Z'),
        updatedAt: new Date('2024-02-01T08:30:00Z')
      },
      {
        id: 4,
        name: 'Fashion Forward Boutique Style Store',
        email: 'hello@fashionforward.com',
        address: '400 Style Avenue, Fashion District, FD 66666',
        ownerId: null, // No owner assigned yet
        createdAt: new Date('2024-02-15T15:10:00Z'),
        updatedAt: new Date('2024-02-15T15:10:00Z')
      },
      {
        id: 5,
        name: 'Green Garden Organic Market Place',
        email: 'organic@greengarden.com',
        address: '500 Organic Street, Health District, HD 77777',
        ownerId: null, // No owner assigned yet
        createdAt: new Date('2024-02-20T09:45:00Z'),
        updatedAt: new Date('2024-02-20T09:45:00Z')
      },
      {
        id: 6,
        name: 'BookWorm Literary Corner Book Store',
        email: 'books@bookworm.com',
        address: '600 Literature Lane, Education Quarter, EQ 88888',
        ownerId: null, // No owner assigned yet
        createdAt: new Date('2024-03-01T14:20:00Z'),
        updatedAt: new Date('2024-03-01T14:20:00Z')
      }
    ], {});

    console.log('✅ Demo stores seeded successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('stores', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6]
      }
    }, {});
    
    console.log('✅ Demo stores removed successfully');
  }
};