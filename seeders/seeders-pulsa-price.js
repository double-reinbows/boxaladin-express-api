'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('pulsaPrices', [{
      displayPrice : 10000,
      aladinPrice : 10000,
      price : 10000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 25000,
      aladinPrice : 25000,
      price : 25000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 50000,
      aladinPrice : 50000,
      price : 50000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 100000,
      aladinPrice : 100000,
      price : 100000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('pulsaPrices', [{
      displayPrice : 10000,
      aladinPrice : 10000,
      price : 10000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 25000,
      aladinPrice : 25000,
      price : 25000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 50000,
      aladinPrice : 50000,
      price : 50000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      displayPrice : 100000,
      aladinPrice : 100000,
      price : 100000,
      decreasePrice : 500,
      opened: 0,
      noInvoice: 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },
};
