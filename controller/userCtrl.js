'use strict'

const db = require('../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')

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

exports.getUser = (req, res) => {
  const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.user.findOne({
    where: { id: decoded.id }
  })
  .then(result => {
    const userInfo = {
      id: result.id,
      username: result.username,
      firstName: result.firstName,
      familyName: result.familyName,
      sex: result.sex,
      email: result.email,
      emailVerified: result.emailVerified,
      aladinKeys: result.aladinKeys,
      coin: result.coin
    }

    res.send(userInfo)
  })
  .catch(err => res.send(err))
}
