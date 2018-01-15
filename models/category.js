'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('category', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    categoryName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        category.hasMany(models.product, {
          foreignkey: 'categoryid'
        })
      }
    }
  });
  return category;
};