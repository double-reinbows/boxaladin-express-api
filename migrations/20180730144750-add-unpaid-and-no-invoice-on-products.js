'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'products',
      'unpaid',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
    queryInterface.addColumn(
      'products',
      'noInvoice',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },


  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'products',
      'unpaid'
    );
    queryInterface.removeColumn(
      'products',
      'noInvoice'
    );
  }
};
