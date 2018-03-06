const jwt = require('jsonwebtoken')

const Model = require('../models')

module.exports = {

  all: (req, res) => {
    Model.win.findAll({
      include: [
        { all: true }
      ]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  byUser: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    Model.win.findAll({
      where: {
        userId: decoded.id
      },
      include: [
        { all: true }
      ]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  create: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    const reward = req.body.star == 5 ? 'active1' : ( req.body.star == 4 ? 'active2' : ( req.body.star == 3 ? 'active3' : ( req.body.star == 2 ? 'active4' : ( req.body.star == 1 ? 'active5' : '' ) ) ) )
    
    Model.reward.findOne({
      where: { [reward]: true }
    })
    .then(result => {

      if (result == null) {
        return res.send({ errmsg: 'tidak ada hadiah buat jumlah star ini' })
      }

      return res.send({
        msg: 'dapat free keys',
        data: req.body,
        data2: decoded
      })

      // req.body.userId = decoded.id
      // req.body.rewardId = result.id
      // req.body.status = 'PENDING'
      // req.body.star = parseInt(req.body.star)

      // Model.win.create(req.body)
      // .then(result => {

      //   Model.win.findOne({
      //     where: {
      //       id: result.id
      //     },
      //     include: [
      //       { all: true }
      //     ]
      //   })
      //   .then(result => res.send(result))
      //   .catch(err => res.send(err))

      // })
      // .catch(err => res.send(err))

    })
    .catch(err => res.send(err))

  },

}