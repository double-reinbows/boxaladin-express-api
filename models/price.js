'use strict';
module.exports = (sequelize, DataTypes) => {
  var price = sequelize.define('price', {
    id:{
      primaryKey: true,
      autoIncrement: true,
      type:DataTypes.INTEGER,
    },
    priceid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },    
    price: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        price.belongsTo(models.product, {
          foreignkey: 'priceid'
        })
      }
    }
  });
  return price;
};