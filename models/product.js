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
  }, {
    classMethods: {
      associate: function(models) {
        product.belongsTo(models.category, {
          foreignKey: 'categoryid',
          as: 'category'
        });
        product.belongsTo(models.brand, {
          foreignKey: 'brandid',
          as: 'brand'
        });
      }
    }
  });
  return product;
};