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

    // const reward = req.body.star == 5 ? 'active1' : ( req.body.star == 4 ? 'active2' : ( req.body.star == 3 ? 'active3' : ( req.body.star == 2 ? 'active4' : ( req.body.star == 1 ? 'active5' : '' ) ) ) )
    
    Model.freekey.findOne({
      where: { star: parseInt(req.body.star) }
    })
    .then(freekeyResult => {

      if (freekeyResult == null) {
        return res.send({ errmsg: 'tidak ada hadiah buat jumlah star ini' })
      }

      Model.user.findOne({
        where: { id: decoded.id }
      })
      .then(userResult => {

        Model.win.create({
          userId: decoded.id,
          freeKeyId: freekeyResult.id
        })
        .then(winResult => {

          Model.user.update({
            aladinKeys: userResult.aladinKeys + freekeyResult.amount
          }, {
            where: {
              id: decoded.id
            }
          })
          .then(result => {

            return res.send({
              freekey: freekeyResult,
              msg: 'user free keys updated'
            })

          })
          .catch(err => res.send(err))

        })
        .catch(err => res.send(err))

      })
      .catch(err => res.send(err))

      // return res.send({
      //   msg: 'dapat free keys',
      //   data: req.body,
      //   data2: decoded,
      //   data3: result
      // })

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