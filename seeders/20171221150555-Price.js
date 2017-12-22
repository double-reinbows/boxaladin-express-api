'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('price', [{
      id: 1,
      price : '10000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      price : '50000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      price : '100000',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('price', [{
      price : '10000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      price : '50000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      price : '100000',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  }
};