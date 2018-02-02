const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')

module.exports = {

  create(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return transaction
      .create({
        userId: decoded.id,
        paymentId: req.body.paymentId,
        productId: req.body.productId,
        aladinPrice: req.body.aladinPrice,
        status: "PENDING",
      })
      .then(data => res.send(data))

      .catch(err => res.status(400).send(err));
  },

  allPendingByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return transaction
      .findAll({
        where: {
          userId: decoded.id,
          status: 'PENDING'
        },
        include: [
          { all: true }
        ]
      })
      .then(data => {
        data.map(transaction => {
          transaction.payment.availableBanks = JSON.parse(transaction.payment.availableBanks)
        })

        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },

  allByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return transaction
      .findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { all: true }
        ]
      })
      .then(data => {
        data.map(transaction => {
          transaction.payment.availableBanks = JSON.parse(transaction.payment.availableBanks)
        })

        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  }

};
