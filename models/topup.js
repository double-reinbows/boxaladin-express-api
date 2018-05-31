'use strict';
module.exports = (sequelize, DataTypes) => {
  var topup = sequelize.define('topup', {
    userId: DataTypes.INTEGER,
    keyId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER,
    xenditId: DataTypes.STRING,
    virtualId: DataTypes.INTEGER,
    status:  DataTypes.STRING
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
    topup.belongsTo(models.virtualAccount, {
      foreignKey: 'virtualId',
    });   
  };
  return topup;
};