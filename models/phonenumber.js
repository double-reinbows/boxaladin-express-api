'use strict';
module.exports = function(sequelize, DataTypes) {
  var phonenumber = sequelize.define('phonenumber', {
    userId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });
  return phonenumber;
};
