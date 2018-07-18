'use strict';
module.exports = (sequelize, DataTypes) => {
  var walletLog = sequelize.define('walletLog', {
    userId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER,
    virtualId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.ENUM('PAID', 'CANCELLED', 'REFUND', 'PENDING')
  });
  walletLog.associate = (models) => {
    walletLog.belongsTo(models.user, {
      foreignKey: 'userId',
    });    
    walletLog.belongsTo(models.payment, {
      foreignKey: 'paymentId',
    });   
    walletLog.belongsTo(models.virtualAccount, {
      foreignKey: 'virtualId',
    });   
  };
  return walletLog;
};