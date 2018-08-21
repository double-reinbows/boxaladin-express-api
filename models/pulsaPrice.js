'use strict';
module.exports = (sequelize, DataTypes) => {
  var pulsaPrice = sequelize.define('pulsaPrice', {
    displayPrice: DataTypes.INTEGER,
    aladinPrice: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    decreasePrice: DataTypes.INTEGER,
    opened: DataTypes.INTEGER,
    noInvoice: DataTypes.INTEGER
  });

  pulsaPrice.associate = (models) => {
    pulsaPrice.hasMany(models.product, {
      foreignKey: 'pulsaPriceId',
      as: 'products',
    });
    pulsaPrice.hasMany(models.aladinkeyLog, {
      foreignKey: 'pulsaPriceId',
      as: 'aladinkeyLogs',
    })
  };

  return pulsaPrice;
};
