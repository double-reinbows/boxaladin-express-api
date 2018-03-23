'use strict';
module.exports = (sequelize, DataTypes) => {
  var gamerule = sequelize.define('gamerule', {
    star: DataTypes.INTEGER,
    pulsaAmount: DataTypes.INTEGER,
    description: DataTypes.STRING
  });

  gamerule.associate = (models) => {

    gamerule.hasMany(models.win, {
      foreignKey: 'gameRuleId',
      as: 'wins',
    });

  }

  return gamerule;
};