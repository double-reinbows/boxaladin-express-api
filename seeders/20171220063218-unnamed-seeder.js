'use strict';

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
      first_name: 'teja',
      family_name: 'harsony',
      password : 'jakarta',
      typed_email : 'teza.harsony230394@gmail.com',
      sex: 'M',
      email: 'tezaharsony230394@gmail.com',
      salt: '12345678',
      coin: '89',
      createdAt: new Date(),
      updatedAt: new Date()
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
