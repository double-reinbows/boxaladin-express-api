const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const db = require('../models')
const hash = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')

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

const handleDotGmail = (obj) => {
  var email = obj.email
  var user = email.split('@')[0]
  var provider = email.split('@')[1]
  
  if (provider == 'gmail.com') {
    let userWithoutDot = user.split('.').join('')
    let result = userWithoutDot + '@gmail.com'
    
    obj.typed_email = obj.email
    obj.email = result

    return console.log(result)
  } else {
    return console.log(email)
  } 
}

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
  db.user.findOne({
    where: {
      $or: [{
        username: req.body.username
      }, {
        email:req.body.username,
        // emailVerified: true
      }]
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
  db.user
    .findOne({
      // attributes: ['username', 'email'],
      where: {
        // $or: [
        //   {
        //     username: req.body.username
        //   },
        //   {
        //     email: req.body.email,
        //     // emailVerified: true
        //   }
        // ]
        email: req.body.email,
        emailVerified: true
      }
    })
    .then(found => {
      if (found) {
        let isUsed = {}
        // if (found.username === req.body.username) isUsed.username = true
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

      // gmailDotCheck(req.body)
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

        console.log('USER CREATED:', data)

        var token = jwt.sign({
          id: data.id,
          username: data.username,
          email: data.email,
          emailVerified: data.emailVerified,
          firstName: data.firstName,
          familyName: data.familyName,
          sex: data.sex,
        },process.env.JWT_SECRET)

        // UPDATE EMAIL TOKEN
        // db.user.update({
        //   emailToken: emailToken
        // }, {
        //   where: {
        //     id: data.id
        //   },
        //   returning: true
        // })
        // .then(userUpdateResult => {
          
          sendEmailVerification(data.email, data.emailToken)

          // CREATE PHONE
          db.phonenumber.create({
            userId: data.id,
            number: req.body.phonenumber,
            verified: false,
            otp: randomOtp,
            primary: true
          })
          .then(dataPhone => {
  
            return res.status(200).send({
              message: "Signup Berhasil",
              token
            })
            
          })
          .catch(error => {
            console.log('error create phone:', error)
            return res.status(400).send(error)
          });

        // })
        // .catch(err => {
        //   console.log(err)
        //   return res.send(err)
        // })

      })
      .catch(error => {
        console.log('error create user:', error.message)
        return res.send(error)
      });

    })
    .catch(err => {
      console.log('error find user:', err)
      return res.send(err)
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
    ReturnPath: 'teza.harsony230394@gmail.com',
    Source: 'teza.harsony230394@gmail.com'
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