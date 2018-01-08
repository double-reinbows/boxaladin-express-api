'use strict'

const jwt = require('jsonwebtoken')

const SECRET = 'aradin'

exports.authUser = (req, res, next) => {
  console.log('authUser')
  if (req.headers.token) {
    jwt.verify(req.headers.token, SECRET, (err, decoded) => {
      if (decoded.username === req.params.username) {
        next()
      }
    })
  } else {
    res.send('not logged')
  }
}
