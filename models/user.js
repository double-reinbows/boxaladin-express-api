'use strict';

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull:false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    family_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    typed_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username_changed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sex: {
      type: DataTypes.ENUM,
      values: ['M','F'],
      allowNull: true
    },
    account_provider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aladin_keys: DataTypes.INTEGER,
    email_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type:DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    coin : {
      type: DataTypes.STRING,
    },
    emailVerificationStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  return user;
};
