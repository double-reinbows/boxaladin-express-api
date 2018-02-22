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

  create: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    const reward = req.body.star == 3 ? 'active1' : ( req.body.star == 2 ? 'active2' : 'active3' )
    
    Model.reward.findOne({
      where: { [reward]: true }
    })
    .then(result => {

      if (result == null) {
        return res.send({ errmsg: 'tidak ada hadiah buat jumlah star ini' })
      }

      req.body.userId = decoded.id
      req.body.rewardId = result.id
      req.body.status = 'PENDING'
      req.body.star = parseInt(req.body.star)

      Model.win.create(req.body)
      .then(result => res.send(result))
      .catch(err => res.send(err))

    })
    .catch(err => res.send(err))

  },

}