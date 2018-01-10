'use strict'

const db = require('../models')
const sequelize = require('sequelize')

exports.getUserData = (req, res) => {
  db.user.findOne({
    where: {
      username: req.params.username
    },
    include: [
      {
        model: db.phonenumber,
        as: 'phonenumbers'
      }
    ]
  })
  .then(data => {
    res.send(data)
  })
}
