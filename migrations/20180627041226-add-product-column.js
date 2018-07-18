'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'products',
      'displayPrice',
      Sequelize.INTEGER
    );
    queryInterface.addColumn(
      'products',
      'decreasePrice',
      Sequelize.INTEGER
    );
    queryInterface.addColumn(
      'products',
      'opened',
      Sequelize.INTEGER
    );
    queryInterface.addColumn(
      'products',
      'sold',
      Sequelize.INTEGER
    );
    
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'products',
      'displayPrice'
    );
    queryInterface.removeColumn(
      'products',
      'decreasePrice'
    );
    queryInterface.removeColumn(
      'products',
      'opened'
    );
    queryInterface.removeColumn(
      'products',
      'sold'
    );
  }
};