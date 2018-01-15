'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('category', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    categoryid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    category: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        category.belongsTo(models.product, {
          foreignkey: 'categoryid'
        })
      }
    }
  });
  return category;
};