'use strict';
module.exports = (sequelize, DataTypes) => {
  var freekey = sequelize.define('freekey', {
    star: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    description: DataTypes.STRING
  });

  freekey.associate = (models) => {
  
    freekey.hasMany(models.win, {
      foreignKey: 'freeKeyId',
      as: 'wins',
    });
  
  };

  return freekey;
};