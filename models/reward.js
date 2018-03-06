'use strict';
module.exports = (sequelize, DataTypes) => {
  var reward = sequelize.define('reward', {
    rewardName: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    aladinKey: DataTypes.INTEGER,
  });

  reward.associate = (models) => {
    reward.hasMany(models.claim, {
      foreignKey: 'rewardId',
      as: 'claims',
    })
  };
  
  return reward;
};