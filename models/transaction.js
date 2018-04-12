'use strict';
module.exports = (sequelize, DataTypes) => {
  var transaction = sequelize.define('transaction', {
    paymentId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    pulsaId: DataTypes.STRING,
    aladinPrice: DataTypes.INTEGER,
    number: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.STRING
  });

  transaction.associate = (models) => {
    transaction.belongsTo(models.payment, {
      foreignKey: 'paymentId',
    });
    transaction.belongsTo(models.product, {
      foreignKey: 'productId',
    });
    transaction.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    
  };

  return transaction;
};