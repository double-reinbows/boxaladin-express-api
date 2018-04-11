const AWS = require('aws-sdk')

exports.sendSMS = (payload) => {

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
    console.log('asdasdas', payload.phone)
    var x = payload.phone
    var splitNumber = x.split('')
    console.log('asd', splitNumber)
    if (splitNumber[0] === '0') {
      splitNumber.splice(0, 1, '62')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] + splitNumber[1] + splitNumber[2] === '+62') {
      splitNumber.splice(0, 3, '62')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] === '8') {
      splitNumber.splice(0, 0, '62')
      var newNumber = splitNumber.join('')
    } else if (splitNumber.length === 0) {
      var newNumber = splitNumber.join('')
    } else {
      var newNumber = x
    }
  var Message = {
    Message: payload.message,
    MessageStructure: 'string',
    PhoneNumber: newNumber,
    Subject: 'your subject',
  }

  sns.publish(Message, function(err, data) {
    if (err) {
      return console.log(err, err.stack); // an error occurred
    } else {
      return console.log(data);           // successful response
    }
  });

  console.log('SEND SMS FROM AWS TO:', newNumber, Message.Message);

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
    ReturnPath: payload.email_return_path,
    Source: payload.email_source
  }
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}