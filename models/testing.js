'use strict';
module.exports = (sequelize, DataTypes) => {
  var testing = sequelize.define('testing', {
    tesusername: DataTypes.STRING,
    tesemail: DataTypes.STRING,
    tespassword: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return testing;
};