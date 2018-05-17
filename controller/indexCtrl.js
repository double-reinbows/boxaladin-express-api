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
    obj.typedEmail = obj.email
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

    obj.typedEmail = obj.email
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
      let token = jwt.sign(
        {
          id: user.id,
          username: user.username || user.email,
          email: user.email,
          emailVerified: user.emailVerified,
          firstName: user.firstName,
          familyName: user.familyName,
          sex: user.sex,
          emailVerified: user.emailVerified
        },
        process.env.JWT_SECRET
      );
      res.send(
      {
        message: 'login success',
        token: token,

      }
    )
    } else if (user.password.substr(6) !== hashedPass.substr(6)) {
      res.send({
        message: 'password incorrect'
      })
    }
  })
}

const sendEmailVerification = (email_address, emailToken) => {
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
          Data: `Click this link to verify your email address: ${
            process.env.BA_WEB_HOST
          }/emailVerification?email=${email_address}&encoded=${emailToken}`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Click this link to verify your email address: ${
            process.env.BA_WEB_HOST
          }/emailVerification?email=${email_address}&encoded=${emailToken}`
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
  db.user
    .findOne({
      where: {
        email: req.body.email,
        emailVerified: true
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
            primary : true
          }
        })
        .then(result => {
          let phoneIsUsed = {}
          if (result !== null) {
            res.send({
              phoneIsUsed
            })
          } else {
            handleDotGmail(req.body)

            req.body.password = hash(req.body.password)
            var salt = Math.floor(Math.random() * 90000) + 10000
            var randomOtp = Math.floor(Math.random() * 900000) + 100000
            req.body.salt = salt
            req.body.emailVerified = false
            req.body.aladinKeys = 0
            req.body.coin = 0
            req.body.emailToken = genRandomString(128)
      
            // CREATE USER
            db.user.create(req.body)
            .then(data => {      
              var token = jwt.sign({
                id: data.id,
                username: data.username,
                email: data.email,
                emailVerified: data.emailVerified,
                firstName: data.firstName,
                familyName: data.familyName,
                sex: data.sex,
              },process.env.JWT_SECRET)      
                sendEmailVerification(data.email, data.emailToken)
      
                // CREATE PHONE
                db.phonenumber.create({
                  userId: data.id,
                  number: req.body.phonenumber,
                  verified: false,
                  otp:randomOtp,
                  primary: false
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
                console.log('error create user:', error.message)
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