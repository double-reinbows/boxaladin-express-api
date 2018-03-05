const Reward = require('../models').reward

module.exports = {

  all: (req, res) => {
    Reward.findAll()
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  create: (req, res) => {
    Reward.create(req.body)
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

}