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
    .then( result => {
      //TODO: investigate if result[]0] is number or string
      if (result[0].toString() === '1') {
        res.send('verifikasi email telah di update')
      } else if (parseInt(result[0].toString()) > 2) {
        res.send('update email lebih dari satu')
      } else {
        res.send('data tidak ditemukan sama sekali')
      }
    })
  },

  editEmail: (req, res) => {
    model.user.update({
      username: req.body.username,
      firstName: req.body.firstname,
      familyName: req.body.familyname,
      email: req.body.email,
      emailVerified: req.body.emailVerified,
      sex: req.body.sex
    }, {
      where: [{
        id: req.params.id
      }]
    })
    res.send('data berhasil di update')
  }
}
