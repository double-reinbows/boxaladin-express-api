'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'products',
      'pulsaPriceId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'products',
      'pulsaPriceId'
    );
  }
};
