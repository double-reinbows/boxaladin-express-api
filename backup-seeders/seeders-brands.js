'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brands', [{
      brandName : 'Telkomsel',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Telkomsel.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'XL',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/XL.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Indosat',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Indosat.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Tri',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Tri.svg',
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
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Smartfren.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Bolt',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Bolt.svg',
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
    queryInterface.bulkDelete('brands', null, {});
  },
};
