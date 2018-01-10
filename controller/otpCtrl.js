const db = require('../models')
const jwt = require('jsonwebtoken')

exports.postPhoneNumber = (req, res) => {
  var randomOtp = Math.floor(Math.random()*900000) + 100000;
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)


  db.phonenumber.findAll({
    where : { userId : decoded.id }
  })
  .then(data => {
    var primaryPhone = null
    console.log(data.length);
    if (data.length == 0) {
      primaryPhone = true
    } else {
      primaryPhone = false
    }

    db.phonenumber.create({
      userId: decoded.id,
      number: req.body.phonenumber,
      verified: false,
      primary: primaryPhone,
      otp: randomOtp
    })
    .then(data => {
      sendSmsVerification(data.number, data.otp)
      res.send(data)
    })

  })


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
      'DefaultSMSType': 'Transactional'
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
  }
  sns.publish(Message, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}
