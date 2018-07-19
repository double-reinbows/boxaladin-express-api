const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const db = require('../models')
const hash = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')
const otpCitCall = require('./phoneCtrl')

const SECRET = 'aradin'

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/**
 * Ini method buat cek dan convert format email Gmail
 * antara alamat email yang dotted dan tidak.
 * Dipindahin dari view/client, karena kalau ditaruh di sana malah ganggu.
 * Kalau dianggap menggangu dan penuh-penuhin kalau ditaruh di sini,
 * (dan memang tidak seharusnya) bisa dibikin jadi modul (helper)
 * dan di-import disini atau di model (dimasukin hook),
 * atau dimasukin langsung ke function signup.
 * Saya pribadi prefer dibikin modul. Kalau dicampur langsung di
 * function signup, function-nya jadi kepanjangan dan imo ga enak diliat.
 */
let gmailDotCheck = obj => {
  let pattern = /(\w+)\.(\w+)@gmail.com/
  if (pattern.test(obj.email)) {
    obj.email = obj.email.replace(pattern, `$1$2@gmail.com`)
  }
  return obj
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const handleDotGmail = (obj) => {
  var email = obj.email
  var user = email.split('@')[0]
  var provider = email.split('@')[1]

  if (provider == 'gmail.com') {
    let userWithoutDot = user.split('.').join('')
    var result = userWithoutDot + '@gmail.com'

    obj.email = result

    return console.log(result)
  } else {
    return console.log(email)
  }
}

exports.getAll = (req, res) => {
  db.user
    .findAll({
      order: [['id', 'ASC']],
    })
    .then(data => {
      res.send(data)
    })
}

exports.signin = (req, res) => {

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

  let hashedPass = hash(req.body.password)

  db.user.findOne({
    where: {
        role: null,
        email: emailFilter
        // emailVerified: true
      }
    })
    .then(user => {
    if (user == null) {
      res.send({
        message: 'username or email not found'
      })
    } else if (user.password.substr(6) === hashedPass.substr(6)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          typedEmail: user.typedEmail,
          emailVerified: user.emailVerified,
          wallet: user.wallet,
          key: user.aladinKeys,
          coin: user.coin
        },
        process.env.JWT_SECRET, {
          expiresIn: "7 days"
        });
      res.send(
      {
        message: 'login success',
        token: token
      }
    )
    } else if (user.password.substr(6) !== hashedPass.substr(6)) {
      res.send({
        message: 'password incorrect'
      })
    }
  })
}

const sendEmailVerification = (email_address, emailToken, typedEmail) => {
  // const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)

  // const emailToken = jwt.sign({
  //   email: decoded.email,
  //   username: decoded.username
  // }, process.env.JWT_SECRET)

  // kirim link ${process.env.BA_API_HOST}/emailVerification?encoded=${emailToken} via email ke email_address
  AWS.config.update({
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const ses = new AWS.SES()
  const params = {
    Destination: {
      ToAddresses: [email_address]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
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
                        padding: 6%;
                        font-size: 34px;
                      ">Halo !
                      </p>
                      <p style="
                        text-align: center;
                        font-size: 30px;
                      ">
                        Kamu baru saja mendaftarkan email ${typedEmail}
                        sebagai akun baru di Boxaladin. Untuk memastikan email ini
                        milik kamu, klik link dibawah ini:
                      </p>
                      <p style="
                        text-align: center;
                        font-size: 30px;
                        padding: 5%;
                      ">
                        KLIK GAMBAR DI BAWAH INI UNTUK VERIFIKASI
                      </p>
                      <div style="
                        width: 100%;
                        padding-bottom: 5%;
                        border-bottom: 5px #FCCD06 solid;
                        text-align: center;
                      ">
                        <a href="${process.env.BA_WEB_HOST}/emailVerification?email=${email_address}&encoded=${emailToken}">
                          <img src="https://s3-ap-southeast-1.amazonaws.com/boxaladin.com/logo.png" style="
                            height: 200px;
                          " />
                        </a>
                      </div>
                      <p style="
                        text-align: center;
                        font-size: 25px;
                      ">
                        ATAU KLIK LINK DI BAWAH INI
                      </p>

                      <p style="
                        text-align:center;
                      ">
                        ${process.env.BA_WEB_HOST}/emailVerification?email=${email_address}&encoded=${emailToken}
                      </p>

                      <p style="
                        text-align:center;
                      ">
                        Terima Kasih, Box Aladin
                      </p>
                    </body>
                  </html>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `
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
                        padding: 6%;
                        font-size: 34px;
                      ">Halo !
                      </p>
                      <p style="
                        text-align: center;
                        font-size: 30px;
                      ">
                        Kamu baru saja mendaftarkan email ${typedEmail}
                        sebagai akun baru di Boxaladin. Untuk memastikan email ini
                        milik kamu, klik link dibawah ini:
                      </p>
                      <p style="
                        text-align: center;
                        font-size: 30px;
                        padding: 5%;
                      ">
                        KLIK GAMBAR DI BAWAH INI UNTUK VERIFIKASI
                      </p>
                      <div style="
                        width: 100%;
                        padding-bottom: 5%;
                        border-bottom: 5px #FCCD06 solid;
                        text-align: center;
                      ">
                        <a href="${process.env.BA_WEB_HOST}/emailVerification?email=${email_address}&encoded=${emailToken}">
                          <img src="https://s3-ap-southeast-1.amazonaws.com/boxaladin.com/logo.png" style="
                            height: 200px;
                          " />
                        </a>
                      </div>
                      <p style="
                        text-align: center;
                        font-size: 25px;
                      ">
                        ATAU KLIK LINK DI BAWAH INI
                      </p>

                      <p style="
                        text-align:center;
                      ">
                        ${process.env.BA_WEB_HOST}/emailVerification?email=${email_address}&encoded=${emailToken}
                      </p>

                      <p style="
                        text-align:center;
                      ">
                        Terima Kasih, Box Aladin
                      </p>
                    </body>
                  </html>
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'boxAladin email verification'
      }
    },
    ReturnPath: 'no-reply@boxaladin.com',
    Source: 'no-reply@boxaladin.com'
  }
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}

exports.verifyEmail = (req, res) => {
  // const decoded = jwt.verify(req.query.encoded, process.env.JWT_SECRET)
  db.user
    .update(
      {
        emailVerified: true
      },
      {
        where: {
          email: req.query.email,
          emailToken: req.query.encoded
        }
      }
    )
    .then(result => res.send({message: 'verification success'}))
    .catch(err => console.log(err))
}

exports.resendEmailVerification = (req, res) => {
  const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  const newEmailToken = genRandomString(128)

  db.user.update({
    emailToken: newEmailToken
  }, {
    where: {
      email: decoded.email
    }
  })
  .then(() => {
    sendEmailVerification(decoded.email, newEmailToken)

    return res.status(200).send({
      message: 'email sent',
      data: decoded
    })

  })
  .catch(err => {
    console.log('ERROR:', err)
    return res.send(err)
  })

}

exports.signup = (req, res) => {
  handleDotGmail(req.body);
  db.user
    .findOne({
      where: {
        email: req.body.email,
        // emailVerified: true
      }
    })
    .then(found => {
      if (found) {
        let isUsed = {}
        if (found.email === req.body.email) isUsed.email = true
        return res.send({isUsed})
      } else {
        db.phonenumber.findOne({
          where: {
            number: req.body.phonenumber,
            primary : true,
            verified: true,
          }
        })
        .then(result => {
          let phoneIsUsed = {}
          if (result) {
            return res.send({
              phoneIsUsed
            })
          } else {
            // handleDotGmail(req.body)

            req.body.password = hash(req.body.password)
            var salt = Math.floor(Math.random() * 90000) + 10000
            var randomOtp = Math.floor(Math.random() * 900000) + 100000
            req.body.salt = salt
            req.body.emailVerified = false
            req.body.aladinKeys = 0
            req.body.coin = 0
            req.body.wallet = 0
            req.body.emailToken = genRandomString(128)
            typedEmail = req.body.typedEmail
            // CREATE USER
            db.user.create(req.body)
            .then(data => {
              const token = jwt.sign({
                id: data.id,
                email: data.email,
                typedEmail: data.typedEmail,
                emailVerified: data.emailVerified,
                wallet: data.wallet,
                key: data.aladinKeys,
                coin: data.coin
              },
              process.env.JWT_SECRET, {
                expiresIn: "7 days"
              });
                sendEmailVerification(data.email, data.emailToken, data.typedEmail)

                // CREATE PHONE
                db.phonenumber.create({
                  userId: data.id,
                  number: req.body.phonenumber,
                  verified: false,
                  otp:0,
                  primary: true,
                })
                .then(dataPhone => {
                  otpCitCall.otp(req, res, data)
                  res.send({
                    message: 'Signup Berhasil',
                    token: token,
                  })
                })
                .catch(error => {
                  console.log('error create phone:', error)
                  return res.status(400).send(error)
                });
              })
              .catch(error => {
                console.log('error create user:', error)
                return res.send(error)
              });
            }
          })
          .catch(err => {
            console.log('error find phone', err)
            res.send(err)
          })
        }
      })
      .catch(err => {
        console.log('error find user:', err)
        return res.send(err)
      })
    }
