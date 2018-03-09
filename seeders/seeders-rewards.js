'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('rewards', [{
      rewardName: 'Apple iPhone 7',
      description: 'Apple iPhone 7 - Rose Gold',
      image: 'https://s3.envato.com/files/194190083/iphone_7_main_rg.jpg',
      aladinKey: 10000,
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      rewardName: 'Playstation Vita',
      description: 'Playstation Vita',
      image: 'http://playstationenthusiast.nintendoenthusiast.com/wp-content/uploads/sites/5/2017/09/psvita-top-article06-en-20161221.png',
      aladinKey: 5000,
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      rewardName: 'Starbucks Bottle',
      description: 'Starbucks Bottle',
      image: 'http://www.starbucks.com.sg/images/default-source/default-album/overlay_1_v2.jpg',
      aladinKey: 1000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('rewards', [{
      rewardName: 'Apple iPhone 7',
      description: 'Apple iPhone 7 - Rose Gold',
      image: 'https://s3.envato.com/files/194190083/iphone_7_main_rg.jpg',
      aladinKey: 10000,
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      rewardName: 'Playstation PS Vita',
      description: 'Playstation PS Vita',
      image: 'http://playstationenthusiast.nintendoenthusiast.com/wp-content/uploads/sites/5/2017/09/psvita-top-article06-en-20161221.png',
      aladinKey: 5000,
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      rewardName: 'Starbucks Bottle',
      description: 'Starbucks Bottle',
      image: 'http://www.starbucks.com.sg/images/default-source/default-album/overlay_1_v2.jpg',
      aladinKey: 1000,
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
