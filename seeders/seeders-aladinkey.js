'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('aladinKeys', [{
      decreasePrice : '500',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('aladinKeys', [{
      decreasePrice : '500',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
