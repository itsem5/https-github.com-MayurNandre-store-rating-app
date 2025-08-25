'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ratings', [
      // Ratings for Best Coffee Shop (Store ID: 1)
      {
        id: 1,
        userId: 2, // John Smith
        storeId: 1,
        rating: 5,
        comment: 'Excellent coffee and amazing atmosphere! The baristas are very knowledgeable and friendly.',
        createdAt: new Date('2024-02-20T10:30:00Z'),
        updatedAt: new Date('2024-02-20T10:30:00Z')
      },
      {
        id: 2,
        userId: 3, // Emily Johnson
        storeId: 1,
        rating: 4,
        comment: 'Good coffee, nice atmosphere. The prices are reasonable and the staff is helpful.',
        createdAt: new Date('2024-02-21T14:15:00Z'),
        updatedAt: new Date('2024-02-21T14:15:00Z')
      },
      {
        id: 3,
        userId: 4, // Michael Brown
        storeId: 1,
        rating: 4,
        comment: 'Love their espresso! Great place to work remotely with good WiFi.',
        createdAt: new Date('2024-02-22T09:45:00Z'),
        updatedAt: new Date('2024-02-22T09:45:00Z')
      },

      // Ratings for Pizza Palace (Store ID: 2)
      {
        id: 4,
        userId: 2, // John Smith
        storeId: 2,
        rating: 3,
        comment: 'Pizza was okay, service could be better. The crust was good but toppings were sparse.',
        createdAt: new Date('2024-02-18T19:30:00Z'),
        updatedAt: new Date('2024-02-18T19:30:00Z')
      },
      {
        id: 5,
        userId: 3, // Emily Johnson
        storeId: 2,
        rating: 4,
        comment: 'Great pizza and friendly staff! Will definitely come back. The garlic bread is amazing.',
        createdAt: new Date('2024-02-19T20:00:00Z'),
        updatedAt: new Date('2024-02-19T20:00:00Z')
      },
      {
        id: 6,
        userId: 4, // Michael Brown
        storeId: 2,
        rating: 4,
        comment: 'Authentic Italian taste and good portion sizes. The delivery was quick too.',
        createdAt: new Date('2024-02-23T18:45:00Z'),
        updatedAt: new Date('2024-02-23T18:45:00Z')
      },

      // Ratings for Tech Gadgets Central (Store ID: 3)
      {
        id: 7,
        userId: 4, // Michael Brown
        storeId: 3,
        rating: 5,
        comment: 'Amazing tech selection and knowledgeable staff! Found exactly what I needed.',
        createdAt: new Date('2024-02-16T16:20:00Z'),
        updatedAt: new Date('2024-02-16T16:20:00Z')
      },
      {
        id: 8,
        userId: 2, // John Smith
        storeId: 3,
        rating: 4,
        comment: 'Good products and competitive prices. The warranty service is excellent.',
        createdAt: new Date('2024-02-17T11:10:00Z'),
        updatedAt: new Date('2024-02-17T11:10:00Z')
      },
      {
        id: 9,
        userId: 3, // Emily Johnson
        storeId: 3,
        rating: 5,
        comment: 'Best tech store in the city! Great customer service and fast repairs.',
        createdAt: new Date('2024-02-24T13:25:00Z'),
        updatedAt: new Date('2024-02-24T13:25:00Z')
      },

      // Ratings for Fashion Forward Boutique (Store ID: 4)
      {
        id: 10,
        userId: 3, // Emily Johnson
        storeId: 4,
        rating: 4,
        comment: 'Trendy clothes and good quality. The sales staff is very helpful with styling advice.',
        createdAt: new Date('2024-02-25T13:45:00Z'),
        updatedAt: new Date('2024-02-25T13:45:00Z')
      },
      {
        id: 11,
        userId: 2, // John Smith
        storeId: 4,
        rating: 3,
        comment: 'Nice selection but a bit pricey. The quality justifies the cost though.',
        createdAt: new Date('2024-02-26T15:30:00Z'),
        updatedAt: new Date('2024-02-26T15:30:00Z')
      },
      {
        id: 12,
        userId: 4, // Michael Brown
        storeId: 4,
        rating: 4,
        comment: 'Great mens section with modern styles. Found some good business casual wear.',
        createdAt: new Date('2024-02-27T12:15:00Z'),
        updatedAt: new Date('2024-02-27T12:15:00Z')
      },

      // Ratings for Green Garden Organic Market (Store ID: 5)
      {
        id: 13,
        userId: 2, // John Smith
        storeId: 5,
        rating: 5,
        comment: 'Fresh organic produce and friendly staff! Love supporting local farmers.',
        createdAt: new Date('2024-03-01T10:20:00Z'),
        updatedAt: new Date('2024-03-01T10:20:00Z')
      },
      {
        id: 14,
        userId: 3, // Emily Johnson
        storeId: 5,
        rating: 4,
        comment: 'Great selection of organic foods. Prices are fair for the quality you get.',
        createdAt: new Date('2024-03-02T14:45:00Z'),
        updatedAt: new Date('2024-03-02T14:45:00Z')
      },

      // Ratings for BookWorm Literary Corner (Store ID: 6)
      {
        id: 15,
        userId: 4, // Michael Brown
        storeId: 6,
        rating: 5,
        comment: 'Amazing bookstore with rare finds! The owner is very knowledgeable about literature.',
        createdAt: new Date('2024-03-05T16:30:00Z'),
        updatedAt: new Date('2024-03-05T16:30:00Z')
      },
      {
        id: 16,
        userId: 3, // Emily Johnson
        storeId: 6,
        rating: 4,
        comment: 'Cozy atmosphere and great book recommendations. Perfect place to browse for hours.',
        createdAt: new Date('2024-03-06T11:20:00Z'),
        updatedAt: new Date('2024-03-06T11:20:00Z')
      }
    ], {});

    console.log('✅ Demo ratings seeded successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ratings', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      }
    }, {});
    
    console.log('✅ Demo ratings removed successfully');
  }
};