const db = require('../models')
const jwt = require('jsonwebtoken')

exports.postPhoneNumber = (req, res) => {
  var randomOtp = Math.floor(Math.random()*900000) + 100000;
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.phonenumber.findAll({
    where: {
      userId: decoded.id
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
      sendSmsVerification(data.number, data.otp)
      res.send({
        message: 'data added',
        data: data
      })
    })
    .catch(err => console.log(err))
  })
  .catch(errCreate => console.log(errCreate))
}

const sendSmsVerification = (phonenumber, otp) => {
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
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
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
