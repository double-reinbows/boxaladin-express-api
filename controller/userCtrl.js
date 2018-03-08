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

exports.decreaseCoin = (req, res) => {
  const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.user.findOne({
    where: {
      id: decoded.id
    }
  })
  .then(result => {

    result.update({
      coin: req.body.coin > 0 ? req.body.coin - 1 : 0
    })
    .then(() => {
      console.log({ message: 'coin updated' })
      return res.send({ message: 'coin updated' })
    })
    .catch(err => {
      console.log(err)
      return res.send(err)
    })

  })
  .catch(err => {
    console.log(err)
    return res.send(err)    
  })
}

exports.buyCoinWithAladinKey = (req, res) => {
  
  const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

  db.user.findOne({
    where: {
      id: decoded.id
    }
  })
  .then(result => {
    
    result.update({
      aladinKeys: result.aladinKeys - req.body.key,
      coin: result.coin + (req.body.key * 10),
    })
    .then(updateResult => {
      
      console.log(updateResult)
      return res.send({ message: 'coin updated' })
      
    })
    .catch(err => {
      console.log(err)
      return res.send(err)
    })

  })
  .catch(err => {
    console.log(err)
    return res.send(err)
  })
  
}
