'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brands', [{
      brandid: 1,
      brand : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 2,
      brand : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 3,
      brand : 'Indosat',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 4,
      brand : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 5,
      brand : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 6,
      brand : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 7,
      brand : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 8,
      brand : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 9,
      brand : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 10,
      brand : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 11,
      brand : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('brands', [{
      brandid: 1,
      brand : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 2,
      brand : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 3,
      brand : 'Indosat',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 4,
      brand : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 5,
      brand : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 6,
      brand : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 7,
      brand : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 8,
      brand : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 9,
      brand : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 10,
      brand : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandid: 11,
      brand : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },
};
