'use strict';

const hasher = require('../helpers/aladin_hash')

const PASSWORD = hasher('boxaladin')

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('users', [{
      username: 'tezaharsony',
      firstName: 'teja',
      familyName: 'harsony',
      password : PASSWORD,
      typedEmail : 'teza.harsony230394@gmail.com',
      sex: 'M',
      email: 'tezaharsony230394@gmail.com',
      salt: '12345678',
      aladinKeys: '99999',
      coin: '9999',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false
    }, {
      username: 'thoriq',
      firstName: 'thoriq',
      familyName: 'faizal',
      password : PASSWORD,
      typedEmail : 'thoriqnfaizal@gmail.com',
      sex: 'M',
      email: 'thoriqnfaizal@gmail.com',
      salt: '12345678',
      aladinKeys: '99999',
      coin: '9999',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false
    }, {
      username: 'anto',
      firstName: 'anto',
      familyName: 'kbarek',
      password : PASSWORD,
      typedEmail : 'anto@gmail.com',
      sex: 'M',
      email: 'anto@gmail.com',
      salt: '12345678',
      aladinKeys: '99999',
      coin: '9999',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false
    }, {
      username: 'andrew',
      firstName: 'andrew',
      familyName: 'andrew',
      password : PASSWORD,
      typedEmail : 'andrew@gmail.com',
      sex: 'M',
      email: 'andrew@gmail.com',
      salt: '12345678',
      aladinKeys: '99999',
      coin: '9999',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
