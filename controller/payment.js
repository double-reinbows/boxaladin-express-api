const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require ('axios')
const db = require('../models')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""

module.exports = {
  createInvoice(req, res) {
    return payment
    .create({
      invoiceId: "null",
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
    })
    .then(dataPayment => {
      let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
      db.transaction.create({
        paymentId: dataPayment.id,
        productId: req.body.productId,
        userId: decoded.id,
        number: req.body.phoneNumber,
        status: "PENDING",
        aladinPrice: req.body.amount
        })
        .then(dataTransaction => {
          db.product.findOne({
            where:{
              id: dataTransaction.dataValues.productId
            }
          })
          .then((resultProduct) => {
            let dataStrPaymentID = dataTransaction.dataValues.paymentId.toString()
            var productDescription = resultProduct.dataValues.productName
            axios({
              method: 'POST',
              url: `https://api.xendit.co/v2/invoices`,
              headers: {
                authorization: process.env.XENDIT_AUTHORIZATION
              },
              data: {
                external_id: dataStrPaymentID,
                amount: req.body.amount,
                payer_email: decoded.email,
                description: productDescription
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
              .then((dataAxios) => {
                db.transaction.update({
                  description: productDescription
                }, {
                  where: {
                    paymentId: dataPayment.id
                  }
                })
                .then((dataTransaksi => {
                  db.transaction.findOne({
                    where: {
                      paymentId: dataPayment.id
                    }
                  })
                  .then(dataFinal => {
                    if (!dataFinal) {
                      return res.status(404).send({
                        message: 'Data Not Found'
                      });
                    }
                    return res.status(200).send(dataFinal);
                  })
                  .catch(error => res.status(400).send(error));
                }))
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
          })
          .catch(err => res.status(400).send(err));
        })
        .catch(err => res.status(400).send(err));
      })
      .catch(err => res.status(400).send(err));
    },

    retrieveInvoice(req, res) {
      return payment
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Payment Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch(error => res.status(400).send(error));
    },
  }