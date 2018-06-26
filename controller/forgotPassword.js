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
          email: emailFilter
        }
      })
      .then(() => {

        awsHelper.sendEmail({
          email_destinations: [emailFilter],
          email_subject: `Box Aladin RESET PASSWORD`,
          email_text: `
          <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <link rel="stylesheet" href="email.css">
                      <title></title>
                    </head>
                    <body style="
                      width: 50%;
                      margin: auto;
                    ">
                      <header style="
                        padding-top: 5%;
                        padding-bottom: 2%;
                        border-bottom: 5px #FCCD06 solid;
                        text-align: center;
                      ">
                        <img src="https://s3-ap-southeast-1.amazonaws.com/boxaladin.com/BoxAladin.png" style="
                          height: 100px;
                        "/>
                      </header>
                      <p style="
                        text-align: center;
                        padding: 2%;
                        font-size: 34px;
                      ">Halo !
                      </p>
                      <p style="
                        text-align: center;
                        font-size: 30px;
                      ">
                      Seseorang baru saja mengajukan permintaan untuk mengganti
                      password pada email ${userResult.typedEmail}. Untuk mengganti
                      password, klik link dibawah ini:
                      </p>
                      <a href="${process.env.BA_WEB_HOST}/resetpassword/${emailFilter}/${emailToken}">
                      <p style="
                        text-align: center;
                        font-size: 30px;
                        padding: 5%;
                      ">
                        UBAH PASSWORD
                      </p>
                      </a>
                      <div style="
                        width: 100%;
                        padding-bottom: 5%;
                        border-bottom: 5px #FCCD06 solid;
                        text-align: center;
                      ">
                      <p style="
                        text-align: center;
                        font-size: 30px;
                      ">
                      Jika kamu tidak mengajukan permintaan ini, abaikan email ini.
Password tidak akan terganti jika kamu tidak meng-klik link di
atas dan membuat password yang baru.
                      </p>
                      </div>

                      <p style="
                        text-align:center;
                        font-size:25px;
                      ">
                        <b>Semakin Dilihat, Semakin Murah!</b>
                      </p>

                      <p style="
                        text-align:center;
                      ">
                        Terima Kasih, Box Aladin
                      </p>
                    </body>
                  </html>
          `,
          email_source: `no-reply@boxaladin.com`,
          email_return_path: `no-reply@boxaladin.com`,
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
