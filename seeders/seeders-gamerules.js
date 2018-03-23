'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('gamerules', [{
      star: 1,
      pulsaAmount: 25000,
      description: 'Pulsa 25.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 2,
      pulsaAmount: 25000,
      description: 'Pulsa 25.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 3,
      pulsaAmount: 50000,
      description: 'Pulsa 50.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 4,
      pulsaAmount: 50000,
      description: 'Pulsa 50.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 5,
      pulsaAmount: 100000,
      description: 'Pulsa 100.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('gamerules', [{
      star: 1,
      pulsaAmount: 25000,
      description: 'Pulsa 25.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 2,
      pulsaAmount: 25000,
      description: 'Pulsa 25.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 3,
      pulsaAmount: 50000,
      description: 'Pulsa 50.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 4,
      pulsaAmount: 50000,
      description: 'Pulsa 50.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 5,
      pulsaAmount: 100000,
      description: 'Pulsa 100.000',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
