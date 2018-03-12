const AWS = require('aws-sdk')

exports.sendSMS = (phonenumber, otp) => {

  AWS.config.region = 'ap-southeast-1';
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  var sns = new AWS.SNS();

  var MessageType = {
    attributes: {
      'DefaultSMSType': 'Transactional',
    }
  };
  
  sns.setSMSAttributes(MessageType, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
    }
  });

  var Message = {
    Message: `Box Aladin OTP: ${otp}`,
    MessageStructure: 'string',
    PhoneNumber: `${phonenumber}`,
    Subject: 'your subject',
  }

  sns.publish(Message, function(err, data) {
    if (err) {
      return console.log(err, err.stack); // an error occurred
    } else {
      return console.log(data);           // successful response
    }
  });

  console.log('SEND SMS FROM AWS TO:', phonenumber, otp);

}

exports.sendEmail = (payload) => {

  AWS.config.update({
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const ses = new AWS.SES()
  const params = {
    Destination: {
      ToAddresses: payload.email_destinations
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: payload.email_text
        },
        Text: {
          Charset: 'UTF-8',
          Data: payload.email_text
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: payload.email_subject
      }
    },
    ReturnPath: payload.email_source,
    Source: payload.email_source
  }
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}