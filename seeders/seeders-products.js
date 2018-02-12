'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('products', [
    {
      productName : 'Pulsa Telkomsel 50.000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "htelkomsel50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Telkomsel 100.000',
      categoryId : 1,
      brandId : 1,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "htelkomsel100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa XL 50.000',
      categoryId : 1,
      brandId : 2,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "xld50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa XL 100.000',
      categoryId : 1,
      brandId : 2,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "xld100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Indosat 50.000',
      categoryId : 1,
      brandId : 3,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "hindosat50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Indosat 100.000',
      categoryId : 1,
      brandId : 3,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "hindosat100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Tri 50.000',
      categoryId : 1,
      brandId : 4,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "hthree50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Tri 100.000',
      categoryId : 1,
      brandId : 4,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "hthree100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    },{
      productName : 'Pulsa Axis 50.000',
      categoryId : 1,
      brandId : 5,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "haxis50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Axis 100.000',
      categoryId : 1,
      brandId : 5,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "haxis100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa Smartfren 50.000',
      categoryId : 1,
      brandId : 6,
      description : '',
      stock : 100,
      price : 50000,
      aladinPrice : 50000,
      pulsaCode: "hsmart50000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      productName : 'Pulsa SmartFren 100.000',
      categoryId : 1,
      brandId : 6,
      description : '',
      stock : 100,
      price : 100000,
      aladinPrice : 100000,
      pulsaCode: "hsmart100000",
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('products', [
      {
        productName : 'Pulsa Telkomsel 50.000',
        categoryId : 1,
        brandId : 1,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "htelkomsel50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Telkomsel 100.000',
        categoryId : 1,
        brandId : 1,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "htelkomsel100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa XL 50.000',
        categoryId : 1,
        brandId : 2,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "xld50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa XL 100.000',
        categoryId : 1,
        brandId : 2,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "xld100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Indosat 50.000',
        categoryId : 1,
        brandId : 3,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "hindosat50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Indosat 100.000',
        categoryId : 1,
        brandId : 3,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "hindosat100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Tri 50.000',
        categoryId : 1,
        brandId : 4,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "hthree50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Tri 100.000',
        categoryId : 1,
        brandId : 4,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "hthree100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      },{
        productName : 'Pulsa Axis 50.000',
        categoryId : 1,
        brandId : 5,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "haxis50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Axis 100.000',
        categoryId : 1,
        brandId : 5,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "haxis100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa Smartfren 50.000',
        categoryId : 1,
        brandId : 6,
        description : '',
        stock : 100,
        price : 50000,
        aladinPrice : 50000,
        pulsaCode: "hsmart50000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }, {
        productName : 'Pulsa SmartFren 100.000',
        categoryId : 1,
        brandId : 6,
        description : '',
        stock : 100,
        price : 100000,
        aladinPrice : 100000,
        pulsaCode: "hsmart100000",
        createdAt : new Date(),
        updatedAt : new Date(),
      }], {});
  },
};
