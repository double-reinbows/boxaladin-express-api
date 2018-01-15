'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('category', {
    categoryName: DataTypes.STRING
  });

  category.associate = (models) => {
    category.hasMany(models.product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
  };

  return category;
};
