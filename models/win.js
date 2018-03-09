'use strict';
module.exports = (sequelize, DataTypes) => {
  var win = sequelize.define('win', {
    userId: DataTypes.INTEGER,
    freeKeyId: DataTypes.INTEGER,
  });

  win.associate = (models) => {
    win.belongsTo(models.freekey, {
      foreignKey: 'freeKeyId',
    });

    win.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  
  return win;
};