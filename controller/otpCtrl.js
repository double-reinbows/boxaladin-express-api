const db = require('../models')
const jwt = require('jsonwebtoken')

exports.all = (req, res) => {
  db.phonenumber.findAll({
    include: [
      {
        all: true
      }
    ]
  })
  .then(result => res.send(result))
  .catch(err => res.send(err))
}

exports.postPhoneNumber = (req, res) => {
  var randomOtp = Math.floor(Math.random()*900000) + 100000;
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.phonenumber.findAll({
    where: {
      userId: decoded.id,
      primary: true
    }
  })
  .then(result => {
    var primaryStatus = null
    result.length == 0 ? primaryStatus = true : primaryStatus = false

    db.phonenumber.create({
      userId: decoded.id,
      number: req.body.phonenumber,
      verified: false,
      otp: randomOtp,
      primary: primaryStatus
    })
    .then(data => {
      res.send({
        message: 'data added',
        data: data
      })
    })
    .catch(err => console.log(err))
  })
  .catch(errCreate => console.log(errCreate))
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
        // console.log('Data buat kirim OTP:', data)
        // awsSendSms(data.number, data.otp)
        awsSendSms(data.number, data.otp)
        res.send({message: 'OTP sent'})
      })
      .catch(err => res.send(err))

    })
    .catch(err => res.send(err))
  })
  .catch(err => res.send(err))
}

const awsSendSms = (phonenumber, otp) => {
  var AWS = require('aws-sdk');
    AWS.config.region = 'ap-southeast-1';
    AWS.config.update({
      accessKeyId: "AKIAICAYQENJJWW6OMIQ",
      secretAccessKey: "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",
    });
  var sns = new AWS.SNS();

  var MessageType = {
    attributes: {
      'DefaultSMSType': 'Transactional',
    }
  };
  
  sns.setSMSAttributes(MessageType, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  var Message = {
    Message: `box aladin OTP: ${otp}`,
    MessageStructure: 'string',
    PhoneNumber: `${phonenumber}`,
    Subject: 'your subject',
  }
  sns.publish(Message, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
    }
  });
  console.log('SEND SMS FROM AWS TO:', phonenumber, otp);
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
  .then(() => res.send({ message: 'Data removed'}))
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
      res.send({
        message: 'data changed',
        data: data
      })
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
      console.log('Wrong OTP');
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

        console.log('primary phone changed')
        res.send({ message: 'primary phone changed'})

      })
      .catch(err => res.send(err))
    }

  })
  
}
