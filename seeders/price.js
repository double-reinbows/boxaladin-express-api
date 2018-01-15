'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('prices', [{
      priceid: 1,
      price : '11000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 2,
      price : '12000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 3,
      price : '30000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 4,
      price : '45000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 5,
      price : '70000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 6,
      price : '100000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 7,
      price : '500000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('prices',[{
      priceid: 1,
      price : '11000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 2,
      price : '12000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 3,
      price : '30000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 4,
      price : '45000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 5,
      price : '70000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 6,
      price : '100000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      priceid: 7,
      price : '500000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  }
};