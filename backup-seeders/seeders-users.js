'use strict';

const hasher = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      username: 'superadmin',
      email: 'superadmin@boxaladin.com',
      firstName: 'superadmin',
      emailToken: genRandomString(128),
      emailVerified: true,
      password: hasher('superadminboxaladin'),
      salt: 0,
      role: 'SUPERADMIN',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      username: 'admin',
      email: 'admin@boxaladin.com',
      firstName: 'admin',
      emailToken: genRandomString(128),
      emailVerified: true,
      password: hasher('adminboxaladin'),
      salt: 0,
      role: 'ADMIN',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('users', [{
      username: 'superadmin',
      email: 'superadmin@boxaladin.com',
      firstName: 'superadmin',
      emailToken: genRandomString(128),
      emailVerified: true,
      password: hasher('superadminboxaladin'),
      salt: 0,
      role: 'SUPERADMIN',
      createdAt : new Date(),
      updatedAt : new Date(),
    }, {
      username: 'admin',
      email: 'admin@boxaladin.com',
      firstName: 'admin',
      emailToken: genRandomString(128),
      emailVerified: true,
      password: hasher('adminboxaladin'),
      salt: 0,
      role: 'ADMIN',
      createdAt : new Date(),
      updatedAt : new Date(),
    },], {});
  },
};
