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

exports.isSuperadmin = (req, res, next) => {
  let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  
  if (decoded.role.toUpperCase() == 'SUPERADMIN') {

    next()

  } else {

    return res.send({
      message: 'not superadmin'
    })

  }
}

exports.isLogin = (req, res, next) => {
  if (req.headers.token != null) {

    next()
    
  } else {

    return res.send({
      message: 'not login'
    })

  }
}