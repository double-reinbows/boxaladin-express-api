'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('category', [{
      id: 1,
      category : 'Pulsa',
    },
    {
      id: 2,
      category : 'Paket Data',
    },
    {
      id: 3,
      category : 'Pulsa',
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('category', [{
      category : 'Pulsa',
    },
    {
      category : 'Paket Data',
    },
    {
      category : 'Pulsa',
    }])
  }
};