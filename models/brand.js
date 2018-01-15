'use strict';
module.exports = (sequelize, DataTypes) => {
  var brand = sequelize.define('brand', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    brandName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        brand.hasMany(models.product, {
          foreignkey: 'brandid'
        })
      }
    }
  });
  return brand;
};