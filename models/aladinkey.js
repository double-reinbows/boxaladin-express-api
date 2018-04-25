'use strict';
module.exports = (sequelize, DataTypes) => {
  var aladinKey = sequelize.define('aladinKey', {
    decreasePrice: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return aladinKey;
};