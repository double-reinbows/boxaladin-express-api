const crypto = require('crypto')

let crypt = (pass, salt) => {
  const cypher = crypto.createCipher('aes192', salt)
  let crypted = cypher.update(pass, 'utf8', 'hex')

  crypted += cypher.final('hex')

  return crypted
};

module.exports = crypt;
