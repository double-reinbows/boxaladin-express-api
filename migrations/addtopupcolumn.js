'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'topups',
      'virtualId',
      Sequelize.INTEGER
    );
    queryInterface.addColumn(
      'topups',
      'status',
      Sequelize.STRING
    );
    
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'topups',
      'virtualId'
    );
    queryInterface.removeColumn(
      'topups',
      'status'
    );
  }
};