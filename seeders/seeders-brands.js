'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brands', [{
      brandName : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Indosat',
      brandLogo: 'https://upload.wikimedia.org/wikipedia/id/c/c0/Indosat_Ooredoo_logo.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('brands', [{
      brandName : 'Telkomsel',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'XL',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Indosat',
      brandLogo: 'https://upload.wikimedia.org/wikipedia/id/c/c0/Indosat_Ooredoo_logo.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Tri',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Axis',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Smartfren',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Bolt',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Garena',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Steam',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'McDonald',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Carrefour',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },
};
