'use strict'

const jwt = require('jsonwebtoken')


exports.isValid = (req, res, next) => {
  if(req.headers.key === process.env.BA_API_KEY) {
    next()
  } else {
    return res.send('API KEY  invalid')
  }
}

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

exports.isLogin = (req, res, next) => {
  if (req.headers.token != null) {

    next()

  } else {

    return res.send({
      message: 'not login'
    })

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

exports.isAdmin = (req, res, next) => {
  let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  if (decoded.role.toUpperCase() == 'ADMIN' || decoded.role.toUpperCase() == 'SUPERADMIN') {

    next()

  } else {

    return res.send({
      message: 'not admin'
    })

  }
}
