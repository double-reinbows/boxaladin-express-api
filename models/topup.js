'use strict';
module.exports = (sequelize, DataTypes) => {
  var topup = sequelize.define('topup', {
    userId: DataTypes.INTEGER,
    keyId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER,
  }); 

  topup.associate = (models) => {
    topup.belongsTo(models.user, {
      foreignKey: 'userId',
    });   
    topup.belongsTo(models.key, {
      foreignKey: 'keyId',
    });   
    topup.belongsTo(models.payment, {
      foreignKey: 'paymentId',
    });   

  };
  return topup;
};