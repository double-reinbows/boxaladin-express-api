'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [{
      categoryName : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('categories', [{
      categoryName : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryName : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
