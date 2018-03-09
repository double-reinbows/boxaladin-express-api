'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('freekeys', [{
      star: 1,
      amount: 100,
      description: '100 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 2,
      amount: 150,
      description: '150 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 3,
      amount: 200,
      description: '200 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 4,
      amount: 250,
      description: '250 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 5,
      amount: 300,
      description: '300 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('freekeys', [{
      star: 1,
      amount: 100,
      description: '100 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 2,
      amount: 150,
      description: '150 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 3,
      amount: 200,
      description: '200 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 4,
      amount: 250,
      description: '250 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      star: 5,
      amount: 300,
      description: '300 free aladin keys',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
