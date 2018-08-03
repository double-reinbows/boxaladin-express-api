'use strict';
module.exports = (sequelize, DataTypes) => {
  var product = sequelize.define('product', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    categoryId:DataTypes.INTEGER,
    brandId:DataTypes.INTEGER,
    productName:DataTypes.STRING,
    description:DataTypes.STRING,
    stock:DataTypes.INTEGER,
    price:DataTypes.INTEGER,
    aladinPrice:DataTypes.INTEGER,
    pulsaCode:DataTypes.STRING,
    displayPrice:DataTypes.INTEGER,
    decreasePrice: DataTypes.INTEGER,
    opened: DataTypes.INTEGER,
    sold: DataTypes.INTEGER,
    active: DataTypes.STRING,
    unpaid: DataTypes.INTEGER,
    noInvoice: DataTypes.INTEGER
  });

  product.associate = (models) => {
    product.belongsTo(models.brand, {
      foreignKey: 'brandId',
      onDelete: 'CASCADE',
    }),
    product.belongsTo(models.category, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
    })
    product.hasMany(models.transaction, {
      foreignKey: 'productId',
      as: 'transactions',
    })
    product.hasMany(models.aladinkeyLog, {
      foreignKey: 'productId',
      as: 'aladinkeyLogs',
    })
  };

  return product;
};
