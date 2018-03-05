const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const db = require('../models')
const hash = require('../helpers/aladin_hash')

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
    obj.typed_email = obj.email
    obj.email = obj.email.replace(pattern, `$1$2@gmail.com`)
  }
  return obj
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

exports.getAll = (req, res) => {
  db.user
    .findAll({
      order: [['username', 'ASC']]
    })
    .then(data => {
      res.send(data)
    })
}

exports.signin = (req, res) => {
  let hashedPass = hash(req.body.password)
  db.user.findOne({where: {username: req.body.username}}).then(user => {
    console.log(user)
    if (user == null) {
      res.send({
        message: 'username not found'
      })
    } else if (user.password.substr(6) === hashedPass.substr(6)) {
      let token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          familyName: user.familyName,
          sex: user.sex,
          emailVerified: user.emailVerified
        },
        process.env.JWT_SECRET
      )

      res.send({
        message: 'login success',
        token: token
      })
    } else if (user.password.substr(6) !== hashedPass.substr(6)) {
      res.send({
        message: 'password incorrect'
      })
    }
  })
}

exports.signup = (req, res) => {
  /**
   * Query pertama tujuannya untuk cek
   * apakah username dan/atau email
   * sudah ada yang pakai.
   * Saya belum cek balikan dari
   * sequelize seandainya user coba input suatu
   * value yang sama ke kolom yang di-set isUnique.
   * Kalau balikannya gampang, bisa dipakai buat simplifikasi
   * kodingan di bawah.
   */
  console.log('>checking...')
  db.user
    .findOne({
      attributes: ['username', 'email'],
      where: {
        $or: [
          {
            username: req.body.username
          },
          {
            email: req.body.email,
            emailVerified: true
          }
        ]
      }
    })
    .then(found => {
      if (found) {
        let isUsed = {}
        if (found.username === req.body.username) isUsed.username = true
        if (found.email === req.body.email) isUsed.email = true
        /**
         * Di sini res.send()-nya pakai return. Jadi klo conditional ini
         * dieksekusi, ga akan lanjut ke query signup
         */
        return res.send({isUsed})
      }

      /**
       * username dan/atau email belum terdaftar.
       * Lanjut ke registrasi (signup)
       */
      console.log('>registering...')

      gmailDotCheck(req.body)

      req.body.password = hash(req.body.password)
      var salt = Math.floor(Math.random() * 90000) + 10000
      var randomOtp = Math.floor(Math.random() * 900000) + 100000
      req.body.salt = salt
      req.body.emailVerified = false
      req.body.aladinKeys = 0

      req.body.email_token = jwt.sign(
        {
          email: req.body.email,
          username: req.body.username
        },
        process.env.JWT_SECRET
      )

      db.user.create(req.body).then(data => {
        sendEmailVerification(data.email, data.email_token)
        var token = jwt.sign(
          {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            familyName: data.familyName,
            sex: data.sex
          },
          process.env.JWT_SECRET
        )
        db.phonenumber.create({
            userId: data.id,
            number: req.body.phonenumber,
            verified: false,
            otp: randomOtp,
            primary: true
          })
          .then(dataPhone => {
            var decoded = jwt.verify(token, process.env.JWT_SECRET)
            res.status(200).send(decoded)
          })
          .catch(error => res.status(400).send(error));
      })
    })
}

const sendEmailVerification = (email_address, email_token) => {
  // const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)

  // const email_token = jwt.sign({
  //   email: decoded.email,
  //   username: decoded.username
  // }, process.env.JWT_SECRET)

  // kirim link ${process.env.BA_API_HOST}/emailVerification?encoded=${email_token} via email ke email_address
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
          }/emailVerification?encoded=${email_token}`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Click this link to verify your email address: ${
            process.env.BA_WEB_HOST
          }/emailVerification?encoded=${email_token}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'boxAladin email verification'
      }
    },
    ReturnPath: 'teza.harsony230394@gmail.com',
    Source: 'teza.harsony230394@gmail.com'
  }
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}

exports.verifyEmail = (req, res) => {
  const decoded = jwt.verify(req.query.encoded, process.env.JWT_SECRET)
  db.user
    .update(
      {
        emailVerified: true
      },
      {
        where: {
          $or: [
            {
              username: decoded.username
            },
            {
              email: decoded.email
            }
          ]
        }
      }
    )
    .then(result => res.send({message: 'verification success'}))
    .catch(err => console.log(err))
}