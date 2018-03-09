'use strict';
module.exports = (sequelize, DataTypes) => {
  var claim = sequelize.define('claim', {
    userId: DataTypes.INTEGER,
    rewardId: DataTypes.INTEGER,
    status: DataTypes.STRING
  });

  claim.associate = (models) => {
    
    claim.belongsTo(models.user, {
      foreignKey: 'userId',
    });

    claim.belongsTo(models.reward, {
      foreignKey: 'rewardId',
    });
    
  };

  return claim;
};