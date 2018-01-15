'use strict';
module.exports = (sequelize, DataTypes) => {
  var brand = sequelize.define('brand', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
      brandid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    brand: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        brand.belongsTo(models.product, {
          foreignkey: 'brandid'
        })
      }
    }
  });
  return brand;
};