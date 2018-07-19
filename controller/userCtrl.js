'use strict'

const db = require('../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')

exports.refreshToken = (req, res) => {
  const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  db.user.findOne({
    where: {
      id: decoded.id
    }
  })
  .then(user => {

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      typedEmail: user.typedEmail,
      emailVerified: user.emailVerified,
      wallet: user.wallet,
      key: user.aladinKeys,
      coin: user.coin
    }, process.env.JWT_SECRET, {
      expiresIn: "7 days"
    })

    return res.send({
      msg: 'refresh token success',
      token
    })

  })
  .catch(err => {

    console.log('error find user', err)
    return res.send(err)

  })
}

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
      email: result.email,
      typedEmail : result.typedEmail,
      emailVerified: result.emailVerified,
      wallet: result.wallet,
      aladinKeys: result.aladinKeys,
      coin: result.coin
    }
    res.send(userInfo)
  })
  .catch(err => console.log(err))
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

      // INCREASE JUMLAH MAIN
      db.gamecount.findAll()
      .then(loseResult => {

        if (loseResult.length == 0) {
          db.gamecount.create({
            count: 1
          })
          .then(createResult => res.send(createResult))
          .catch(err => res.send(err))
        } else {
          loseResult[0].update({
            count: loseResult[0].count + 1
          })
          .then(createResult => res.send({ message: 'coin & game count updated' }))
          .catch(err => res.send(err))
        }

      })
      .catch(err => res.send(err))

      // return res.send({ message: 'coin updated' })
    })
    .catch(err => {
      return res.send(err)
    })

  })
  .catch(err => {
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
    console.log(result)
    if (result.aladinKeys < req.body.key) {
      res.send({
        message: 'aladinkey tidak cukup'
      })
    } else if (result.aladinKeys <= 0) {
      res.send({
        message: 'aladinkey 0'
      })
    }else {
      result.update({
        aladinKeys: result.aladinKeys - req.body.key,
        coin: result.coin + (req.body.key * 5),
      })
      .then(updateResult => {
        console.log(updateResult)
        return res.send({ message: 'coin updated' })
      })
      .catch(err => {
        console.log(err)
        return res.send(err)
      })
    }
  })
  .catch(err => {
    console.log(err)
    return res.send(err)
  })

}
