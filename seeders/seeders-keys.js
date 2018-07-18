'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('keys', [{
      price : '10000',
      keyAmount: '10',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '20000',
      keyAmount: '20',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '50000',
      keyAmount: '50',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '100000',
      keyAmount: '100',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('keys', [{
      price : '10000',
      keyAmount: '10',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '20000',
      keyAmount: '20',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '50000',
      keyAmount: '50',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '100000',
      keyAmount: '100',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
