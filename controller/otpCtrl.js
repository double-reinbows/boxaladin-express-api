const db = require('../models')
const jwt = require('jsonwebtoken')

exports.postPhoneNumber = (req, res) => {
  var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  db.phonenumber.create({
    userId: decoded.id,
    number: req.body.phonenumber,
    verified: false
  })
  .then(data => {
    res.send(data)
  })
}
