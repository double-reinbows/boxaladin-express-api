'use strict';
module.exports = (sequelize, DataTypes) => {
  var price = sequelize.define('price', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },    
    price: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        price.belongsTo(models.product, {
          foreignkey: 'id'
        })
      }
    }
  });
  return price;
};