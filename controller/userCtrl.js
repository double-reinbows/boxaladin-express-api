'use strict'

const db = require('../models')

exports.getUserData = (req, res) => {
  db.user.findOne(req.body.username)
  .then(data => {
    res.send(data)
  })
}
