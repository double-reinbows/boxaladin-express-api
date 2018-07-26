const model = require('../models')
const hasher = require('../helpers/aladin_hash')

module.exports = {
  updateEmailStatus: (req, res) => {
    model.user.update({
      emailVerified: true,
    }, {
      where: [{
        typedEmail: req.body.email
      }]
    })
    .then( data => {
      if (data[0].toString() === '1') {
        res.send('verifikasi email telah di update')
      } else {
        res.send('data tidak ditemukan')
      }
    })
  },

  editEmail: (req, res) => {
    model.user.update({
      username: req.body.username,
      firstName: req.body.firstname,
      familyName: req.body.familyname,
      password: hasher(req.body.password),
      email: req.body.email
    }, {
      where: [{
        id: req.params.id
      }]
    })
    .then( data => {
      if (data[0].toString() === '1') {
        res.send('email telah di update')
      } else {
        res.send('data tidak ditemukan')
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}
