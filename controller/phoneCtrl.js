const db = require('../models')
const jwt = require('jsonwebtoken')
const awsHelper = require('../helpers/aws')
const otp = require('./otp')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  /* need to INSTALL the package XMLHttpRequest */
const axios = require('axios')

exports.all = (req, res) => {
  db.phonenumber.findAll({
    include: [
      {
        all: true
      }
    ]
  }).then(result => res.send(result)).catch(err => res.send(err))
}

exports.postPhoneNumber = (req, res) => {
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  var splitNumber = req.body.phonenumber.split('')

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
    var newNumber = req.body.phonenumber.replace(/\D/g,'');
  }

  db.phonenumber.findOne({
    where: {
      userId: decoded.id,
      number : newNumber,
    }
  }).then(result => {
    //user already has this number on their account
    if (result) {return res.send('duplicate number')}
    res.send({message: 'data added'})
    db.phonenumber.create({
      userId: decoded.id,
      number: newNumber,
      verified: false,
      otp: 99999,
      primary: false
    })
  }).catch(errCreate => console.log(errCreate))
}

exports.sendSmsVerification = (req, res) => {
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  var randomOtp = Math.floor(Math.random()*900000) + 100000;

  db.phonenumber.findById(req.body.phoneId)
  .then(findResult => {

    db.phonenumber.update({
      number: findResult.number,
      primary: findResult.primary,
      verified: findResult.verified,
      otp: randomOtp,
      userId: decoded.id
    }, {
      where: {
        id: findResult.id
      }
    })
    .then(updateResult => {

      db.phonenumber.findById(findResult.id)
      .then(data => {

        let message = `Box Aladin OTP: ${data.otp}`

        awsHelper.sendSMS({
          phone: data.number,
          message
        })

        return res.send({ message: 'OTP sent' })

      })
      .catch(err => res.send(err))

    })
    .catch(err => res.send(err))
  })
  .catch(err => res.send(err))
}

exports.getPhoneByUser = (req, res) => {
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.phonenumber.findAll({
    where: {
      userId: decoded.id
    }
  })
  .then(result => {
    var dataPhoneNumbers = []
    result.map(data => {
      dataPhoneNumbers.push({
        id: data.id,
        userId: data.userId,
        number: data.number,
        verified: data.verified,
        primary: data.primary,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      })
    })

    res.send({
      messsage: 'data found',
      data: dataPhoneNumbers
    })
  })
  .catch(err => console.log(err))
}

exports.verifyPhoneNumber = (req, res) => {
  db.phonenumber.findOne({
    where: {
      id: req.body.numberId
    }
  })
  .then(result => {
    if (result.otp == req.body.otp) {
      db.phonenumber.update({
        verified: true
      }, {
        where: {
          id: result.id
        }
      })
      .then(updateResult => {
        res.send({
          message: 'phone verified',
          data: updateResult
        })
      })
      .catch(updateErr => res.send(updateErr))
    } else {
      res.send({
        message: 'incorrect otp'
      })
    }
  })
  .catch(err => res.send(err))
}

exports.removePhone = (req, res) => {
  db.phonenumber.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(() => res.send(
    { message: 'Data removed'}
  ))
  .catch(err => res.send(err))
}

exports.changePhone = (req, res) => {
  db.phonenumber.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(result => {
    db.phonenumber.update({
      number: req.body.phonenumber || result.number,
      verified: req.body.verified || result.verified,
      primary: req.body.primaryStatus || result.primaryStatus
    }, {
      where: {
        id: parseInt(req.params.id)
      }
    })
    .then(data => {
      res.send(
        // message: 'data changed',
        // data: data
        data.dataValues
      )
    })
    .catch(err => console.log(err))
  })
  .catch(errChange => console.log(errChange))
}

exports.changePrimary = (req, res) => {
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.phonenumber.findById(req.body.numberId)
  .then(findResult => {
    if (findResult.otp != req.body.otp) {
      res.send({ message: 'Wrong OTP'})
    } else {

      db.phonenumber.findAll({
        where: {
          userId: decoded.id
        }
      })
      .then(result => {

        result.map(phone => {
          var primary = false
          phone.id == req.body.numberId ? primary=true : null
          // console.log(phone.number, primary)

          db.phonenumber.update({
            primary: primary
          }, {
            where: {
              id: phone.id
            }
          })
          .then(updateResult => console.log({
              message: 'updated',
              data: updateResult
            })
          )
          .catch(err => console.log(err))

        })

        res.send({ message: 'primary phone changed'})

      })
      .catch(err => res.send(err))
    }

  })

}

exports.getAllPhone = (req, res) => {
  db.phonenumber.findOne({
    where: {
      userId: req.params.id,
      primary: 'TRUE'
    },
  })
  .then(result => {
    res.send(result)
  })
  .catch(err => res.send(err))
}

exports.otp = (req, res, data) => {
  var dataCitCall = JSON.stringify({
    "userid": `${process.env.CITCALL_USER}`,
    "password": `${process.env.CITCALL_PASSWORD}`,
    "msisdn": `${req.body.phonenumber}`,
    "gateway": "0"
  });

  axios({
    method: 'POST',
    url: `https://gateway.citcall.com/v1/call`,
    data: dataCitCall,
  })
  .then(databalikan => {
    var json = databalikan.data

    otp.updateOtp(req, res, json)
  })
  .catch(err => console.log(err))
}

exports.signUpVerify = (req, res) => {
  console.log('email verify', req.body.email)
  db.user.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(dataUser => {
    db.phonenumber.findOne({
      where: {
        number: req.body.phonenumber,
        verified: false,
        userId: dataUser.id,
        primary: true,
      }
    })
    .then(result => {
      console.log(result)
      if (!result){
        return res.send({
          message: 'Hp pernah diverifikasi'
        })
      } else {
        console.log('found number: ',result)
        //check otp is longer than 2, less than 2 means it's an error code
        if (result.otp > 99 && result.otp == req.body.otp) {//double = due to string vs int
          db.phonenumber.update({
            verified: true,
          }, {
            where: {
              id: result.id,
            }
          });
          db.user.update({
            aladinKeys: 5,
          },{
            where:{
              id: result.userId,
            }
          }).then((finalResult) => {
            if (finalResult.length === 1) {
              return res.send({
                message: 'phone verified',
              })
            } else if (finalResult.length > 1) {
              //TODO: send an email that tells us we just gave keys to more than
              //one account!!!
            } else {
              return res.send({
                message: 'Failed to add free keys',
              })
            }
          })
        } else {
          res.send({
            message: 'incorrect otp'
          })
        }
      }
    })
  }).catch(err => console.log(err))
}

exports.oldUserVerify = (req, res) => {
  console.log('email verify', req.body.email)
  db.user.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(dataUser => {
    db.phonenumber.findOne({
      where: {
        number: req.body.phonenumber,
        verified: false,
        userId: dataUser.id
      }
    })
    .then(result => {
      if (result === null){
        res.send({
          message: 'Phone Terverifikasi'
        })
      } else{
        if (result.otp == req.body.otp) {
          db.phonenumber.update({
            verified: true,
            primary: true
          }, {
            where: {
              id: result.id
            }
          })
          .then((finalResult) => {
            res.send({
              message: 'phone verified',
            })
          })
          .catch(error =>res.status(400).send(error));
        } else {
          res.send({
            message: 'incorrect otp'
          })
          .catch(err => console.log(err))
        }
      }
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
}
