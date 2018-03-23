'use strict';
module.exports = (sequelize, DataTypes) => {
  var win = sequelize.define('win', {
    userId: DataTypes.INTEGER,
    gameRuleId: DataTypes.INTEGER,
    winToken: DataTypes.STRING
  });

  win.associate = (models) => {
    win.belongsTo(models.gamerule, {
      foreignKey: 'gameRuleId',
    });

    win.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  
  return win;
};