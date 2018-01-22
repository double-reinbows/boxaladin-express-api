'use strict';
module.exports = (sequelize, DataTypes) => {
  var payment = sequelize.define('payment', {
    status: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    availableBanks: DataTypes.STRING
  });

  payment.associate = (models) => {
    payment.hasMany(models.transaction, {
      foreignKey: 'paymentId',
      as: 'transactions',
    });    
  };

  return payment;
};