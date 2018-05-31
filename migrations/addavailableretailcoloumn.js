'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'payments',
      'availableretail',
      Sequelize.TEXT
    );
    
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'payments',
      'availableretail'
    );
  }
};