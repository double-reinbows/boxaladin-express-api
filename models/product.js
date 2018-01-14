'use strict';
module.exports = (sequelize, DataTypes) => {
  var product = sequelize.define('product', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    categoryid: DataTypes.INTEGER,
    brandid: DataTypes.INTEGER,
    priceid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        product.hasMany(models.category, {
          foreignKey: 'id',
          as: 'category'
        });
        product.hasMany(models.brand, {
          foreignKey: 'id',
          as: 'brand'
        });
        product.hasMany(models.price, {
          foreignKey: 'id',
          as: 'price'
        });      }
    }
  });
  return product;
};