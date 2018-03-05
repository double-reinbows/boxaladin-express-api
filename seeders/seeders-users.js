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
      coin: '5',
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
      coin: '5',
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
