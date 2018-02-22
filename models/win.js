'use strict';
module.exports = (sequelize, DataTypes) => {
  var win = sequelize.define('win', {
    userId: DataTypes.INTEGER,
    rewardId: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    status: DataTypes.STRING
  });

  win.associate = (models) => {
    win.belongsTo(models.reward, {
      foreignKey: 'rewardId',
    });

    win.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  
  return win;
};