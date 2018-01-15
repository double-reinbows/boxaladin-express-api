'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('products', [{
      productName : 'Pulsa Telkomsel 100000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 100000,
      aladinPrice : 100000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },{
      productName : 'Pulsa Telkomsel 20000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 20000,
      aladinPrice : 20000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      productName : 'Pulsa Telkomsel 50000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 50000,
      aladinPrice : 50000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('products', [{
      productName : 'Pulsa Telkomsel 100000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 100000,
      aladinPrice : 100000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },{
      productName : 'Pulsa Telkomsel 20000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 20000,
      aladinPrice : 20000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      productName : 'Pulsa Telkomsel 50000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 5,
      price : 50000,
      aladinPrice : 50000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
