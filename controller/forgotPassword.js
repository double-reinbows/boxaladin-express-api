const jwt = require('jsonwebtoken')

const db = require('../models')
const awsHelper = require('../helpers/aws')
const hash = require('../helpers/aladin_hash')

module.exports = {

  requestViaEmail: (req, res) => {
  
    db.user.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(userResult => {

      if (userResult == null) {
        return res.send({ msg: 'email tidak ada' })
      }

      awsHelper.sendEmail({
        email_destinations: [userResult.email],
        email_subject: `Box Aladin RESET PASSWORD`,
        email_text: `Click here to RESET Your password: ${process.env.BA_WEB_HOST}/resetpassword?encoded=${userResult.emailToken}`,
        email_source: `teza.harsony230394@gmail.com`
      })

      return res.send({
        msg: 'email sent'
      })

    })
    .catch(err => res.send(err))

  },

  reset: (req, res) => {

    const decoded = jwt.verify(req.query.encoded, process.env.JWT_SECRET)
    const newPassword = hash(req.body.password)
    const newEmailToken = jwt.sign({
      email: decoded.email,
      username: decoded.username
    }, process.env.JWT_SECRET)

    db.user.findOne({
      where: {
        $and: [{
          username: decoded.username
        }, {
          email: decoded.email
        }]
      }
    })
    .then(userResult => {
      if (userResult.emailToken != req.query.encoded) {
        return res.send({ msg: 'link expired' })
      }

      db.user.update({
        password: newPassword,
        emailToken: newEmailToken
      }, {
        where: {
          $and: [{
            username: decoded.username
          }, {
            email: decoded.email
          }]
        }
      })
      .then(result => res.send({ msg: 'password updated' }))
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
  }

}
