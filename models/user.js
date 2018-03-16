'use strict';

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sex: {
      type: DataTypes.ENUM,
      values: ['M','F'],
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    typedEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usernameChanged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accountProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aladinKeys: {
      type: DataTypes.INTEGER
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coin: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  });

  user.associate = (models) => {
    user.hasMany(models.phonenumber, {
      foreignKey: 'userId',
      as: 'phonenumbers',
    });
    user.hasMany(models.transaction, {
      foreignKey: 'userId',
      as: 'transactions',
    });
    user.hasMany(models.topup, {
      foreignKey: 'userId',
      as: 'topups',
    });
    
    user.hasMany(models.win, {
      foreignKey: 'userId',
      as: 'wins',
    });

    user.hasMany(models.claim, {
      foreignKey: 'userId',
      as: 'claims',
    });

  };

  return user;
};
