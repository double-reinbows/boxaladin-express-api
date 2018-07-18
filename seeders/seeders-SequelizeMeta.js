'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SequelizeMeta', [{
       name : '20171220043401-create-boxaladin.js'
      },
      {
       name : '20171220071843-create-phonenumber.js'
      },
      {
       name : '20180114074411-create-category.js'
      },
      {
       name : '20180114074435-create-brand.js'
      },
      {
       name : '20180114074518-create-product.js'
      },
      {
       name : '20180119065501-create-transaction.js'
      },
      {
       name : '20180122041604-create-payment.js'
      },
      {
       name : '20180207071414-create-topup.js'
      },
      {
       name : '20180207074241-create-key.js'
      },
      {
       name : '20180222081626-create-reward.js'
      },
      {
       name : '20180222082303-create-win.js'
      },
      {
       name : '20180306055553-create-claim.js'
      },
      {
       name : '20180322064103-create-game-rule.js'
      },
      {
       name : '20180413031104-create-gamecount.js'
      },
      {
       name : '20180619041226-create-virtual-account.js'
      },
      {
       name : '20180620041226-create-aladinkey-log.js'
      },
      {
       name : '20180623041226-add-available-retail-coloumn.js'
      },
      {
       name : '20180627041226-add-product-column.js'
      },
      {
       name : '20180627053226-add-topup-column.js'
      },
      {
       name : '20180628041226-add-transaction-column.js'
      }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('SequelizeMeta', null, {});
  },
};
