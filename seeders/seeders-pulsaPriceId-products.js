'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `UPDATE products SET "pulsaPriceId"=1 WHERE price=10000 and "categoryId" = 1;
      UPDATE products SET "pulsaPriceId"=2 WHERE price=25000 and "categoryId" = 1;
      UPDATE products SET "pulsaPriceId"=3 WHERE price=50000 and "categoryId" = 1;
      UPDATE products SET "pulsaPriceId"=4 WHERE price=100000 and "categoryId" = 1;`
    );
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('UPDATE products SET "pulsaPriceId"=null');
  },
};
