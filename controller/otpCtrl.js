const db = require('../models')
const jwt = require('jsonwebtoken')

exports.postPhoneNumber = (req, res) => {
  var randomOtp = Math.floor(Math.random()*900000) + 100000;
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  db.phonenumber.create({
    userId: decoded.id,
    number: req.body.phonenumber,
    verified: false,
    otp: randomOtp
  })
  .then(data => {
    res.send(data)
  })
}
