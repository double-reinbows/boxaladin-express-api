'use strict';
module.exports = (sequelize, DataTypes) => {
  var gamerule = sequelize.define('gamerule', {
    star: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
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