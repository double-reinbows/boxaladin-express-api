'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brands', [{
      brandName : 'Telkomsel',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/telkomsel.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'XL',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/xl.svg',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      brandName : 'Indosat',
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Indosat2.svg',
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
      brandLogo: 'https://s3-ap-southeast-1.amazonaws.com/iconpulsa/Smart.svg',
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
