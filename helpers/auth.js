'use strict'

const jwt = require('jsonwebtoken')

exports.authUser = (req, res, next) => {
  if (req.headers.token) {
    jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded.username === req.params.username) {
        next()
      }
    })
  } else {
    res.send('not logged')
  }
}
