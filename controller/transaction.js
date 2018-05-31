const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const db = require('../models')

module.exports = {

  allPendingByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return transaction
      .findAll({
        where: {
          userId: decoded.id,
          status: "PENDING"
        },
        include: [{ all: true }]
      })
      .then((data) => {
        data.map(transaction => {
          if (transaction.payment) {
            transaction.payment.availableBanks = JSON.parse(transaction.payment.availableBanks)
          }
        });
        res.send(data);
      })

      .catch(err => res.status(400).send(err));
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
          if (transaction.payment) {
            transaction.payment.availableBanks = JSON.parse(transaction.payment.availableBanks)
          }
        })
        res.send(data)
      })

      .catch(err => {
        console.log('ERROR FIND TRANSACTION:', err)
        return res.status(400).send(err)
      })
  },

  byId(req, res) {
    // return transaction
    console.log('id', req.params.id)
    db.transaction.findById(req.params.id, {
      include: [
        { model: db.payment },
        { model: db.product },
        { model: db.virtualAccount }
      ]
    })
      .then(data => {
        data.payment.availableBanks = JSON.parse(data.payment.availableBanks)
        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },

  // byId(req, res) {
  //   console.log('id', req.params.id)
  //   db.transaction.findById(req.params.id, {
  //   })
  //     .then(dataTransaction => {
  //       db.payment.findOne({
  //         where: {
  //           id: dataTransaction.paymentId
  //         }
  //       })
  //       .then(dataPayment => {
  //         db.virtualAccount.findOne({
  //           where:{
  //             id: dataTransaction.virtualId
  //           }
  //         })
  //         .then(dataFinal => {
  //           res.send({
  //             dataTransaction,
  //             dataPayment,
  //             dataFinal
  //           })
  //         })
  //       })
  //     })
  //     .catch(err => res.status(400).send(err))
  // },

};
