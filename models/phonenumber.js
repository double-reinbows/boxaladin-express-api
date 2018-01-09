'use strict';
module.exports = function(sequelize, DataTypes) {
    var phonenumber = sequelize.define('phonenumber', {
      userId: DataTypes.INTEGER,
      number: DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      otp: DataTypes.INTEGER
    });

phonenumber.associate = (models) => {
  phonenumber.belongsTo(models.user, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
};

  return phonenumber;
};
