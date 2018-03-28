const jwt = require('jsonwebtoken')
const model = require('../models')

const hasher = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')

module.exports = {

  login: (req, res) => {

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

    let hashedPass = hasher(req.body.password)
  
    model.user.findOne({
      where: {
        $or: [{
          role: 'SUPERADMIN',
          email: emailFilter
        }, {
          role: 'ADMIN',
          email: emailFilter
        }]
      }
    })
    .then(user => {

      if (user == null) {

        res.send({
          message: 'username or email not found'
        })

      } else if (user.password.substr(6) === hashedPass.substr(6)) {

        let token = jwt.sign({
          id: user.id,
          username: user.username || user.email,
          email: user.email,
          emailVerified: user.emailVerified,
          firstName: user.firstName,
          familyName: user.familyName,
          sex: user.sex,
          emailVerified: user.emailVerified,
          role: user.role,
        }, process.env.JWT_SECRET);

        res.send({
          message: 'login success',
          token: token,
        })

      } else if (user.password.substr(6) !== hashedPass.substr(6)) {

        res.send({
          message: 'password incorrect'
        })

      }
    })
  },

  create: (req, res) => {

    model.user.create({
      email: req.body.email,
      emailVerified: false,
      emailToken: genRandomString(128),
      username: req.body.username,
      firstName: req.body.firstName,
      password: hasher(req.body.email),
      role: 'ADMIN',
      salt: 0,
    })
    .then(result => {
      console.log('--- CREATE USER ADMIN --- :', result)
      return res.send({
        message: 'success',
        data: result
      })
    })
    .catch(err => {
      console.log('ERROR CREATE USER ADMIN:', err)
      return res.send(err)
    })
  },

  getAll: (req, res) => {
    model.user
      .findAll({
        order: [['id', 'ASC']],
        include: 
          {
            all: true
          }
        
      })

      .then(data => {
        console.log('data', data)
        res.send(data)
      })
      .catch(err => res.send(err))
  },

  getPhone(req, res){
    model.phonenumber.findOne({
      where: {
        userId: 3
      }
    })
    .then(data => {res.send(data)
    })
    .catch(err => res.send(err))
  }

}