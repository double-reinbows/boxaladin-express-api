'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brands', [{
      brand : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Indosat',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('brands', [{
      brand : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Indosat',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brand : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },
};
