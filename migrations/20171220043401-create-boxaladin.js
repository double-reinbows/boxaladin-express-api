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
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      family_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      typed_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      username_changed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sex: {
        type: Sequelize.ENUM,
        values: ['M','F'],
        allowNull: true
      },
      account_provider: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aladin_keys: {
        type: Sequelize.INTEGER
      },
      email_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coin: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      emailVerificationStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
