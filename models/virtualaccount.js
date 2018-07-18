'use strict';
module.exports = (sequelize, DataTypes) => {
  var virtualAccount = sequelize.define('virtualAccount', {
    userId: DataTypes.INTEGER,
    bankCode: DataTypes.STRING,
    virtualAccountNumber: DataTypes.STRING
  });

  virtualAccount.associate = (models) => {
    virtualAccount.hasMany(models.transaction, {
      foreignKey: 'virtualId',
      as: 'transactions',
    });
    virtualAccount.hasMany(models.topup, {
      foreignKey: 'virtualId',
      as: 'topups',
    });
    virtualAccount.hasMany(models.walletLog, {
      foreignKey: 'virtualId',
      as: 'walletLogs',
    });
  };
  return virtualAccount;
};