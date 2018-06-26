'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'payments',
      'expiredAt',
      Sequelize.INTEGER
    );
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'payments',
      'expiredAt',
      Sequelize.INTEGER
    );
  }
};
