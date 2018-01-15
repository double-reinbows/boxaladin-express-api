'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('prices', [{
      price : '11000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '12000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '30000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '45000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '70000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '100000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '500000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('prices',[{
      price : '11000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '12000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '30000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '45000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '70000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '100000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      price : '500000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  }
};