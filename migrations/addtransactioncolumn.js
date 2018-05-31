'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'transactions',
      'virtualId',
      Sequelize.INTEGER
    );
    
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'transactions',
      'virtualId'
    );
  }
};
