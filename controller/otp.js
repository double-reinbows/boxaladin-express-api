const db = require('../models')
const phoneHelper = require('../helpers/phone')
const jwt = require('jsonwebtoken')
const citcall = require('./phoneCtrl')

module.exports = {
  sentOtp(req, res, json, emailFilter){
    db.user.findOne({
      where: {
        email: emailFilter
      }
    })
    .then( user => {
      if (json.rc === '00'){
        var phone = json.token
        var splitNumber = phone.split('')
        if (splitNumber[0] === '0') {
          splitNumber.splice(0, 1, '0')
          var newNumber = splitNumber.join('')
        } else if (splitNumber[0] + splitNumber[1] + splitNumber[2] === '+62') {
          splitNumber.splice(0, 3, '0')
          var newNumber = splitNumber.join('')
        } else if (splitNumber[0] + splitNumber[1] === '62') {
          splitNumber.splice(0, 2, '0')
          var newNumber = splitNumber.join('')
        } else if (splitNumber.length === 0) {
          var newNumber = splitNumber.join('')
        } else {
          var newNumber = phone
        }
        var otpFinal = newNumber.slice(7)

        db.phonenumber.update({
          otp: otpFinal
        },{
          where: {
            number: req.body.phonenumber,
            userId: user.id
          }
        })
        .then(dataHpUser => {
          console.log('otp sent')
        })
        .catch(err => console.log(err))
        } else {
          db.phonenumber.update({
            otp: json.rc
          },{
            where: {
              number: req.body.phonenumber,
              userId: user.id
            }
          })
          .then(updatePhone => {
            console.log('err')
            res.send('error')
          })
          .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))
  },

  oldUserVerification(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    var phone = req.body.phonenumber
    var splitNumber = phone.split('')
  
    if (splitNumber[0] === '0') {
      splitNumber.splice(0, 1, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] + splitNumber[1] + splitNumber[2] === '+62') {
      splitNumber.splice(0, 3, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] + splitNumber[1] === '62') {
      splitNumber.splice(0, 2, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] === '8') {
      splitNumber.splice(0, 0, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber.length === 0) {
      var newNumber = splitNumber.join('')
    } else {
      var newNumber = phone
    }

    db.phonenumber.findAll({
      where: {
          number: newNumber,
          primary: true,
      }
    })
    .then(checkNumber => {
      if (checkNumber.length === 0){
        db.phonenumber.create({
          userId: decoded.id,
          number: newNumber,
          verified: false,
          otp: 404,
          primary: false
        })
        .then(data => {
          citcall.otp(req, res)
          res.send({
            message: 'data added',
            data: data
          })
        })
        .catch(err => res.send(err))
      } else if (checkNumber.length !== 0) {
          res.send('ada no hp verified/primary')
      }
    })
    .catch(err => console.log(err))
  }
}