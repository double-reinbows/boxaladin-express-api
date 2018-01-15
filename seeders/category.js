'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [{
      category : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('categories', [{
      category : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      category : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
