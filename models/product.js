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
    aladinPrice:DataTypes.INTEGER
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
  };

  return product;
};
