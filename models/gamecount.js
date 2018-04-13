'use strict';
module.exports = (sequelize, DataTypes) => {
  var gamecount = sequelize.define('gamecount', {
    count: DataTypes.INTEGER
  }, {});
  gamecount.associate = function(models) {
    // associations can be defined here
  };
  return gamecount;
};