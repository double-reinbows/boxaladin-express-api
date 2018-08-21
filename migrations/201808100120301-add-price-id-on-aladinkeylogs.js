'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'aladinkeyLogs',
      'pulsaPriceId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'aladinkeyLogs',
      'pulsaPriceId'
    );
  }
};
