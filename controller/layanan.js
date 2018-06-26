const AWS = require('aws-sdk')

module.exports={
  sendEmailService(req,res) {
    recevier: req.body.receiver
    email: req.body.email
    phone: req.body.phone
    line: req.body.line
    subject: req.body.subject
    content: req.body.content
    sendEmailVerification(req.body.email, req.body.phone, req.body.line, req.body.receiver, req.body.subject, req.body.content)
    res.send(req.body)
  }
}

const sendEmailVerification = (email, phone, line, receiver, subject, content) => {
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
      ToAddresses: [receiver]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `from ${email}, ${line}, ${phone} : ${content}`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `from ${email}, ${line}, ${phone} : ${content}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${subject}`
      }
    },
    ReturnPath: 'no-reply@boxaladin.com',
    Source: 'no-reply@boxaladin.com'
  }
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}