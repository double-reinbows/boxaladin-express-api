'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [{
      categoryid: 1,
      category : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 2,
      category : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 3,
      category : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 4,
      category : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('categories', [{
      categoryid: 1,
      category : 'Pulsa',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 2,
      category : 'Paket Data',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 3,
      category : 'Voucher Game',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      categoryid: 4,
      category : 'Voucher Hiburan',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
