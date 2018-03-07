const jwt = require('jsonwebtoken')
const Model = require('../models')

module.exports = {

  create: (req, res) => {

    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    
    // CARI REWARD
    Model.reward.findOne({
      where: {
        id: req.body.rewardId
      }
    })
    .then(rewardResult => {

      // CARI USER
      Model.user.findOne({
        where: {
          id: decoded.id
        }
      })
      .then(userResult => {
  
        // UPDATE ALADIN KEY-NYA USER
        Model.user.update({
          aladinKeys: userResult.aladinKeys - rewardResult.aladinKey
        }, {
          where: {
            id: decoded.id
          }
        })
        .then(updateResult => {
    
          // CREATE DATA CLAIM
          Model.claim.create({
            userId: decoded.id,
            rewardId: req.body.rewardId,
            status: 'PENDING'
          })
          .then(result => res.send(result))
          .catch(err => res.send(err))

        })
        .catch(err => res.send(err))

      })
      .catch(err => res.send(err))

    })
    .catch(err => res.send(err))

  },

  allByUser: (req, res) => {

    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    Model.claim.findAll({
      where: {
        userId: decoded.id
      },
      include: [{
        all: true
      }]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))

  },

  all: (req, res) => {

    Model.claim.findAll({
      include: [{
        all: true
      }]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))

  },

}