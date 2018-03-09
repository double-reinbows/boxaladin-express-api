const payment = require('../models').payment;
const transaction = require('../models').transaction;
const topup = require('../models').topup;
const axios = require ('axios')
const db = require('../models')
const jwt = require('jsonwebtoken')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""

module.exports = {
  topUpKeys(req, res) {
    db.key.findById(req.body.keyId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      db.payment.create ({
        invoiceId: "null",
        status: "PENDING",
        amount: data.price,
        availableBanks: "null",
      })
      .then((dataPayment) => {
        let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
        db.topup.create({
        paymentId: dataPayment.id,
        userId: decoded.id,
        keyId: req.body.keyId
        })
        .then((dataTopUp) => {
          let dataStrPaymentID = dataTopUp.paymentId.toString()
          axios({
            method: 'POST',
            url: `https://api.xendit.co/v2/invoices`,
            headers: {
              authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="
            },
            data: {
              external_id: dataStrPaymentID,
              amount: dataPayment.amount,
              payer_email: decoded.email,
              description: "asd"
            },
          })
          .then(({data}) => {
            invoice = data.id,
            banksArr_Obj = data.available_banks
            banksStr = JSON.stringify(banksArr_Obj)
            db.payment.update({
              invoiceId: invoice,
              availableBanks: banksStr
            },{
              where:{
                id: dataPayment.id
              }
            })
            .then((data)=>{
              db.topup
              .findOne({
                where: {
                  paymentId: dataPayment.id
                }
              })
              .then(data => {
                if (!data) {
                  return res.status(404).send({
                    message: 'Data Not Found',
                  });
                }
                return res.status(200).send(data);
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(err => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },

  all(req, res) {
    db.key.findAll()
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  allPendingByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return topup
      .findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { all: true }
        ]
      })
      .then(data => {
        data.map(dataTopup => {
          dataTopup.payment.availableBanks = JSON.parse(dataTopup.payment.availableBanks)
        })

        let dataPending = data.filter(data => data.payment.status == 'PENDING')

        res.send(dataPending)
      })

      .catch(err => res.status(400).send(err))
  },

  allByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return topup
      .findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { all: true }
        ]
      })
      .then(data => {
        data.map(dataTopup => {
          dataTopup.payment.availableBanks = JSON.parse(dataTopup.payment.availableBanks)
        })

        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },

  byId(req, res) {
    return topup
      .findOne({
        where: {
          id: parseInt(req.params.id)
        },
        include: [
          { all: true }
        ]
      })
      .then(data => {
        data.payment.availableBanks = JSON.parse(data.payment.availableBanks)
        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },
};
