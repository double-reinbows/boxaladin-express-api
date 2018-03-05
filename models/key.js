'use strict';
module.exports = (sequelize, DataTypes) => {
  var key = sequelize.define('key', {
    price: DataTypes.INTEGER,
    keyAmount: DataTypes.INTEGER
  });

  key.associate = (models) => {
    key.hasOne(models.topup, {
      foreignKey: 'keyId',
      as: 'keys',
    });
  };
  return key;
};