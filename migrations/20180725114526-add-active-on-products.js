'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'products',
      'active',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'products',
      'active'
    );
  }
};
