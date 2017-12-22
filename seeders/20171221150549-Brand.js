'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('brand', [{
      id: 1,
      brand : 'Telkomsel',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      brand : 'Axis',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      brand : 'Im3',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('brand', [{
      brand : 'Telkomsel',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand : 'Axis',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand : 'Im3',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  }
};