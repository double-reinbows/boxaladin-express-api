const jwt = require('jsonwebtoken')

const db = require('../models')
const awsHelper = require('../helpers/aws')
const hash = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')

module.exports = {

  requestViaEmail: (req, res) => {
    var email1 = req.body.email
    var user = email1.split('@')[0]
    var provider = email1.split('@')[1]
  
    if (provider == 'gmail.com') {
      let userWithoutDot = user.split('.').join('')
      var result = userWithoutDot + '@gmail.com'
      var emailFilter = result
    } else {
      var emailFilter = email1
    } 

    const emailToken = genRandomString(128)
  
    db.user.findOne({
      where: {
        email: emailFilter
      }
    })
    .then(userResult => {

      if (userResult == null) {
        return res.send({ msg: 'email tidak ada' })
      }

      db.user.update({
        emailToken: emailToken
      }, {
        where: {
          email: req.body.email
        }
      })
      .then(() => {

        awsHelper.sendEmail({
          email_destinations: [req.body.email],
          email_subject: `Box Aladin RESET PASSWORD`,
          email_text: `Click here to RESET Your password: ${process.env.BA_WEB_HOST}/resetpassword?email=${req.body.email}&encoded=${emailToken}`,
          email_source: `teza.harsony230394@gmail.com`,
          email_return_path: `teza.harsony230394@gmail.com`,
        })
  
        return res.send({
          msg: 'email sent'
        })

      })
      .catch(err => {
        console.log('error update emailToken:', err)
        return res.send(err)
      })

    })
    .catch(err => {
      console.log('error find user:', err)
      return res.send(err)
    })

  },

  reset: (req, res) => {

    const newPassword = hash(req.body.password)
    const newEmailToken = genRandomString(128)

    db.user.findOne({
      where: {
        email: req.query.email,
        emailToken: req.query.encoded
      }
    })
    .then(userResult => {
      if (userResult == null) {
        return res.send({ msg: 'link expired' })
      }

      db.user.update({
        password: newPassword,
        emailToken: newEmailToken
      }, {
        where: {
          email: req.query.email,
          emailToken: req.query.encoded
        }
      })
      .then(result => res.send({ msg: 'password updated' }))
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
  }

}
