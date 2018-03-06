'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('rewards', [{
      rewardName: 'iPhone 7',
      description: 'iPhone 7 rose gold',
      image: 'https://s3.envato.com/files/194190083/iphone_7_main_rg.jpg',
      aladinKey: 7000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('rewards', [{
      rewardName: 'iPhone 7',
      description: 'iPhone 7 rose gold',
      image: 'https://s3.envato.com/files/194190083/iphone_7_main_rg.jpg',
      aladinKey: 7000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
