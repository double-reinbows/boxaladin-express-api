'use strict';
module.exports = (sequelize, DataTypes) => {
  var reward = sequelize.define('reward', {
    rewardName: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    active1: DataTypes.BOOLEAN,
    active2: DataTypes.BOOLEAN,
    active3: DataTypes.BOOLEAN
  });

  reward.associate = (models) => {
    reward.hasMany(models.win, {
      foreignKey: 'rewardId',
      as: 'wins',
    })
  };
  
  return reward;
};