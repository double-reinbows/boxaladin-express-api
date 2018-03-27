'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      familyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sex: {
        type: Sequelize.ENUM,
        values: ['M','F'],
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        },
        allowNull: false,
        unique: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      typedEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      usernameChanged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      accountProvider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aladinKeys: {
        type: Sequelize.INTEGER
      },
      emailToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coin: {
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
