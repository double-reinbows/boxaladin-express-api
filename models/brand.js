'use strict';
module.exports = (sequelize, DataTypes) => {
  var brand = sequelize.define('brand', {
    brandName: DataTypes.STRING
  });

  brand.associate = (models) => {
    brand.hasMany(models.product, {
      foreignKey: 'brandId',
      as: 'products',
    });
  };

  return brand;
};
